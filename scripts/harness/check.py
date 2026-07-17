#!/usr/bin/env python3
"""Run fast deterministic checks for the project-owned CardStats harness."""

import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any, Iterable


ROOT = Path(sys.argv[0]).resolve().parents[2]
MANIFEST_PATH = ROOT / ".harness/manifest.json"
PLACEHOLDER = re.compile(r"__[A-Z][A-Z0-9_]*__|\[TODO(?::[^\]]*)?\]", re.IGNORECASE)
MARKDOWN_LINK = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
SECRET_PATTERNS = (
    re.compile(r"-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----"),
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    re.compile(r"\bgh[pousr]_[A-Za-z0-9]{36,}\b"),
    re.compile(r"\bsk-[A-Za-z0-9_-]{24,}\b"),
)
ALLOWED_MANIFEST_STATUSES = {"discovery", "operational"}
ALLOWED_WORK_STATUSES = {"not_started", "active", "blocked", "passing"}


def load_json(path: Path, errors: list[str]) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        errors.append(f"cannot read {path.relative_to(ROOT)} as JSON: {exc}")
        return None


def safe_path(relative: Any) -> Path | None:
    if not isinstance(relative, str) or not relative or Path(relative).is_absolute():
        return None
    candidate = (ROOT / relative).resolve()
    try:
        candidate.relative_to(ROOT)
    except ValueError:
        return None
    return candidate


def strings(value: Any) -> Iterable[str]:
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for item in value:
            yield from strings(item)
    elif isinstance(value, dict):
        for item in value.values():
            yield from strings(item)


def git(*args: str) -> str | None:
    result = subprocess.run(
        ["git", "-C", str(ROOT), *args],
        check=False,
        capture_output=True,
        text=True,
        timeout=10,
    )
    return result.stdout.strip() if result.returncode == 0 else None


def referenced_paths(manifest: dict[str, Any]) -> set[str]:
    result: set[str] = set()
    sources = manifest.get("sources")
    if isinstance(sources, dict):
        for value in sources.values():
            if isinstance(value, str):
                result.add(value)
            elif isinstance(value, list):
                result.update(item for item in value if isinstance(item, str))
    budgets = manifest.get("budgets")
    if isinstance(budgets, list):
        for budget in budgets:
            if isinstance(budget, dict) and isinstance(budget.get("paths"), list):
                result.update(item for item in budget["paths"] if isinstance(item, str))
    clients = manifest.get("clients")
    adapters = clients.get("adapters") if isinstance(clients, dict) else None
    if isinstance(adapters, dict):
        result.update(item for item in adapters.values() if isinstance(item, str))
    return result


def check_markdown(path: Path, errors: list[str]) -> None:
    text = path.read_text(encoding="utf-8")
    for raw_target in MARKDOWN_LINK.findall(text):
        target = raw_target.strip().split("#", 1)[0]
        if not target or "://" in target or target.startswith(("mailto:", "#", "<")):
            continue
        target = target.split(" ", 1)[0]
        candidate = (path.parent / target).resolve()
        try:
            candidate.relative_to(ROOT)
        except ValueError:
            errors.append(f"markdown link escapes repository in {path.relative_to(ROOT)}: {target}")
            continue
        if not candidate.exists():
            errors.append(f"broken link in {path.relative_to(ROOT)}: {target}")


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    manifest = load_json(MANIFEST_PATH, errors)
    if not isinstance(manifest, dict):
        print("Harness check failed:\n- manifest is unavailable", file=sys.stderr)
        return 1

    if manifest.get("schemaVersion") != 1:
        errors.append("manifest.schemaVersion must equal 1")
    if manifest.get("status") not in ALLOWED_MANIFEST_STATUSES:
        errors.append("manifest.status must be discovery or operational")
    if manifest.get("project") != {"name": "CardStats", "root": "."}:
        errors.append("manifest.project must identify CardStats with portable root '.'")
    commands = manifest.get("commands")
    if not isinstance(commands, dict) or any(
        not isinstance(commands.get(name), str) or not commands[name].strip()
        for name in ("context", "check", "verify")
    ):
        errors.append("manifest must define context, check, and verify commands")

    paths = referenced_paths(manifest)
    harness_files = {MANIFEST_PATH}
    for relative in sorted(paths):
        path = safe_path(relative)
        if path is None:
            errors.append(f"unsafe manifest path: {relative!r}")
        elif not path.is_file():
            errors.append(f"missing manifest path: {relative}")
        else:
            harness_files.add(path)

    for text in strings(manifest):
        match = PLACEHOLDER.search(text)
        if match:
            errors.append(f"unresolved manifest placeholder: {match.group(0)}")

    budgets = manifest.get("budgets")
    names: set[str] = set()
    if not isinstance(budgets, list) or not budgets:
        errors.append("manifest.budgets must be a non-empty list")
    else:
        for index, budget in enumerate(budgets):
            if not isinstance(budget, dict):
                errors.append(f"budget {index} must be an object")
                continue
            name = budget.get("name")
            limit = budget.get("maxBytes")
            budget_paths = budget.get("paths")
            if not isinstance(name, str) or not name or name in names:
                errors.append(f"budget {index} has an invalid or duplicate name")
                continue
            names.add(name)
            if not isinstance(limit, int) or isinstance(limit, bool) or limit <= 0:
                errors.append(f"budget {name} must have a positive maxBytes")
                continue
            if not isinstance(budget_paths, list) or not budget_paths:
                errors.append(f"budget {name} must include paths")
                continue
            total = 0
            for relative in budget_paths:
                path = safe_path(relative)
                if path is None or not path.is_file():
                    errors.append(f"budget {name} references missing/unsafe path: {relative}")
                else:
                    total += path.stat().st_size
            if total > limit:
                errors.append(f"budget {name} is over limit: {total} > {limit} bytes")

    sources = manifest.get("sources") if isinstance(manifest.get("sources"), dict) else {}
    work_path = safe_path(sources.get("workState"))
    handoff_path = safe_path(sources.get("handoff"))
    work = load_json(work_path, errors) if work_path and work_path.is_file() else None
    handoff = load_json(handoff_path, errors) if handoff_path and handoff_path.is_file() else None
    work_ids: set[str] = set()
    if not isinstance(work, dict):
        errors.append("work state must be a JSON object")
    else:
        expected_statuses = ["not_started", "active", "blocked", "passing"]
        if work.get("schemaVersion") != 1 or work.get("allowedStatuses") != expected_statuses:
            errors.append("work state schema or allowed status order is invalid")
        items = work.get("items")
        if not isinstance(items, list):
            errors.append("work state items must be a list")
            items = []
        active = 0
        for item in items:
            if not isinstance(item, dict) or not isinstance(item.get("id"), str):
                errors.append("every work item must have a string id")
                continue
            if item["id"] in work_ids:
                errors.append(f"duplicate work item id: {item['id']}")
            work_ids.add(item["id"])
            if item.get("status") not in ALLOWED_WORK_STATUSES:
                errors.append(f"invalid status for {item['id']}: {item.get('status')}")
            active += item.get("status") == "active"
            for relative in item.get("sources", []):
                source_path = safe_path(relative)
                if source_path is None or not source_path.is_file():
                    errors.append(f"work item {item['id']} has missing/unsafe source: {relative}")
            if item.get("status") == "blocked" and not item.get("blocker"):
                errors.append(f"blocked work item {item['id']} lacks blocker evidence")
            if item.get("status") == "passing" and not item.get("completion"):
                errors.append(f"passing work item {item['id']} lacks completion evidence")
        if active > 1 and not work.get("parallelMode"):
            errors.append("multiple active work items while parallel mode is disabled")

    if not isinstance(handoff, dict):
        errors.append("handoff must be a JSON object")
    else:
        required_lists = (
            "scope",
            "completed",
            "nextActions",
            "decisions",
            "openQuestions",
            "risks",
            "touchedPaths",
            "doNotRepeat",
            "contextSources",
        )
        if handoff.get("schemaVersion") != 1:
            errors.append("handoff.schemaVersion must equal 1")
        for key in required_lists:
            if not isinstance(handoff.get(key), list):
                errors.append(f"handoff.{key} must be a list")
        for task_id in handoff.get("scope", []):
            if task_id not in work_ids:
                errors.append(f"handoff scope references unknown work item: {task_id}")
        verification = handoff.get("verification")
        if not isinstance(verification, dict) or any(
            not isinstance(verification.get(key), list) for key in ("passed", "failed", "notRun")
        ):
            errors.append("handoff verification must contain passed, failed, and notRun lists")
        recorded_git = handoff.get("git") if isinstance(handoff.get("git"), dict) else {}
        actual_branch = git("branch", "--show-current")
        actual_head = git("rev-parse", "HEAD")
        actual_status = git("status", "--short")
        actual_worktree = "dirty" if actual_status else "clean" if actual_status is not None else None
        recorded_head = recorded_git.get("head")
        distance_text = (
            git("rev-list", "--count", f"{recorded_head}..{actual_head}")
            if isinstance(recorded_head, str) and actual_head and recorded_head != actual_head
            else None
        )
        clean_closeout = (
            distance_text == "1"
            and recorded_git.get("worktree") == "dirty"
            and actual_worktree == "clean"
        )
        if actual_branch is not None and recorded_git.get("branch") != actual_branch:
            errors.append(
                f"handoff Git branch differs: recorded={recorded_git.get('branch')!r}, "
                f"actual={actual_branch!r}"
            )
        if actual_head is not None and recorded_head != actual_head and not clean_closeout:
            errors.append(
                f"handoff Git head differs: recorded={recorded_head!r}, actual={actual_head!r}"
            )
        if (
            actual_worktree is not None
            and recorded_git.get("worktree") != actual_worktree
            and not clean_closeout
        ):
            errors.append(
                f"handoff Git worktree differs: recorded={recorded_git.get('worktree')!r}, "
                f"actual={actual_worktree!r}"
            )

    for path in harness_files:
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        match = PLACEHOLDER.search(text)
        if match:
            errors.append(f"unresolved placeholder in {path.relative_to(ROOT)}: {match.group(0)}")
        if any(pattern.search(text) for pattern in SECRET_PATTERNS):
            errors.append(f"possible secret-like content in {path.relative_to(ROOT)}")
        if path.suffix.lower() == ".md":
            check_markdown(path, errors)

    if manifest.get("status") == "operational":
        warnings.append("operational status requires recorded behavioral evidence beyond this check")

    if errors:
        print(f"Harness check: {len(errors)} error(s), {len(warnings)} warning(s)")
        for error in errors:
            print(f"- ERROR: {error}")
        for warning in warnings:
            print(f"- WARNING: {warning}")
        return 1
    print(f"Harness check: passing ({len(paths)} referenced paths, {len(budgets)} budgets)")
    for warning in warnings:
        print(f"- WARNING: {warning}")
    return 0


raise SystemExit(main())
