#!/usr/bin/env python3
"""Print compact, deterministic CardStats startup context without mutating the repository."""

import json
import subprocess
import sys
from pathlib import Path
from typing import Any


ROOT = Path(sys.argv[0]).resolve().parents[2]
MANIFEST_PATH = ROOT / ".harness/manifest.json"


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"cannot read {path.relative_to(ROOT)}: {exc}") from exc
    if not isinstance(value, dict):
        raise RuntimeError(f"{path.relative_to(ROOT)} must contain a JSON object")
    return value


def git(*args: str) -> str:
    result = subprocess.run(
        ["git", "-C", str(ROOT), *args],
        check=False,
        capture_output=True,
        text=True,
        timeout=10,
    )
    if result.returncode != 0:
        detail = result.stderr.strip() or "Git command failed"
        raise RuntimeError(detail)
    return result.stdout.strip()


def relative_json(manifest: dict[str, Any], source: str) -> dict[str, Any]:
    sources = manifest.get("sources")
    relative = sources.get(source) if isinstance(sources, dict) else None
    if not isinstance(relative, str) or not relative:
        raise RuntimeError(f"manifest sources.{source} is missing")
    path = (ROOT / relative).resolve()
    try:
        path.relative_to(ROOT)
    except ValueError as exc:
        raise RuntimeError(f"manifest sources.{source} escapes the repository") from exc
    return load_json(path)


def main() -> int:
    try:
        manifest = load_json(MANIFEST_PATH)
        state = relative_json(manifest, "workState")
        handoff = relative_json(manifest, "handoff")
        branch = git("branch", "--show-current")
        head = git("rev-parse", "HEAD")
        status_lines = git("status", "--short").splitlines()
    except RuntimeError as exc:
        print(f"context error: {exc}", file=sys.stderr)
        return 1

    items = state.get("items") if isinstance(state.get("items"), list) else []
    active = [item for item in items if isinstance(item, dict) and item.get("status") == "active"]
    selected = active[0] if active else next(
        (item for item in items if isinstance(item, dict) and item.get("status") != "passing"),
        None,
    )
    actual_worktree = "dirty" if status_lines else "clean"
    conflicts: list[str] = []
    recorded_git = handoff.get("git") if isinstance(handoff.get("git"), dict) else {}
    recorded_head = recorded_git.get("head")
    distance = None
    if isinstance(recorded_head, str) and recorded_head != head:
        try:
            distance_text = git("rev-list", "--count", f"{recorded_head}..{head}")
            distance = int(distance_text)
        except (RuntimeError, ValueError):
            distance = None
    clean_closeout = (
        distance == 1
        and recorded_git.get("worktree") == "dirty"
        and actual_worktree == "clean"
    )
    if recorded_git.get("branch") != branch:
        conflicts.append(f"handoff branch={recorded_git.get('branch')!r}, Git branch={branch!r}")
    if recorded_head != head and not clean_closeout:
        conflicts.append(f"handoff head={recorded_head}, Git head={head}")
    if recorded_git.get("worktree") != actual_worktree and not clean_closeout:
        conflicts.append(
            f"handoff worktree={recorded_git.get('worktree')}, Git worktree={actual_worktree}"
        )
    if len(active) > 1 and not state.get("parallelMode"):
        conflicts.append(f"{len(active)} active items while parallel mode is disabled")

    print("CardStats harness context")
    print(f"root: {ROOT}")
    print(f"git: {branch} @ {head[:12]} ({actual_worktree}, {len(status_lines)} changed paths)")
    print(f"harness: {manifest.get('status', 'unknown')}")
    if selected:
        print(f"work: {selected.get('id')} [{selected.get('status')}] — {selected.get('title')}")
        print(f"sources: {', '.join(selected.get('sources', []))}")
    else:
        print("work: none")
    passed = handoff.get("verification", {}).get("passed", [])
    failed = handoff.get("verification", {}).get("failed", [])
    not_run = handoff.get("verification", {}).get("notRun", [])
    print(f"verification: {len(passed)} passed, {len(failed)} failed, {len(not_run)} not run")
    if conflicts:
        print("conflicts:")
        for conflict in conflicts:
            print(f"- {conflict}")
    else:
        print("conflicts: none")
    if clean_closeout:
        print("checkpoint: one clean closeout commit follows the recorded dirty state")
    next_actions = handoff.get("nextActions")
    next_action = next_actions[0] if isinstance(next_actions, list) and next_actions else None
    if not next_action and selected:
        next_action = selected.get("nextAction")
    print(f"next: {next_action or 'No next action recorded; repair the handoff.'}")
    return 2 if conflicts else 0


raise SystemExit(main())
