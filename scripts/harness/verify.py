#!/usr/bin/env python3
"""Verify CardStats harness state and the presence of routed application delivery gates."""

import ast
import json
import subprocess
import sys
from pathlib import Path


ROOT = Path(sys.argv[0]).resolve().parents[2]
SCRIPTS = (
    ROOT / "scripts/harness/context.py",
    ROOT / "scripts/harness/check.py",
    ROOT / "scripts/harness/verify.py",
)


def run(command: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
        timeout=30,
    )


def main() -> int:
    failures: list[str] = []
    for script in SCRIPTS:
        try:
            ast.parse(script.read_text(encoding="utf-8"), filename=str(script))
        except (OSError, UnicodeDecodeError, SyntaxError) as exc:
            failures.append(f"syntax check failed for {script.relative_to(ROOT)}: {exc}")

    check = run([sys.executable, "scripts/harness/check.py"])
    if check.returncode != 0:
        failures.append("harness check failed\n" + (check.stdout + check.stderr).strip())

    context = run([sys.executable, "scripts/harness/context.py"])
    if context.returncode != 0:
        failures.append(
            "context command reported a state conflict\n" + (context.stdout + context.stderr).strip()
        )
    elif len(context.stdout.encode("utf-8")) > 10000:
        failures.append("context output exceeds 10,000 bytes")
    required_markers = (
        "CardStats harness context",
        "git:",
        "work:",
        "verification:",
        "conflicts:",
        "next:",
    )
    for marker in required_markers:
        if marker not in context.stdout:
            failures.append(f"context output is missing marker: {marker}")

    diff = run(["git", "diff", "--check"])
    if diff.returncode != 0:
        failures.append("git diff --check failed\n" + (diff.stdout + diff.stderr).strip())

    package_path = ROOT / "package.json"
    product_gate_summary = "not configured"
    if package_path.is_file():
        try:
            package = json.loads(package_path.read_text(encoding="utf-8"))
        except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
            failures.append(f"package.json is unreadable: {exc}")
        else:
            scripts = package.get("scripts") if isinstance(package, dict) else None
            required_scripts = ("lint", "typecheck", "test", "test:e2e", "build", "db:migrate", "db:seed")
            missing_scripts = [
                name for name in required_scripts
                if not isinstance(scripts, dict) or not isinstance(scripts.get(name), str)
            ]
            if missing_scripts:
                failures.append("package.json is missing delivery scripts: " + ", ".join(missing_scripts))
            required_product_paths = (
                ROOT / "prisma/schema.prisma",
                ROOT / "prisma/migrations",
                ROOT / "src/app",
                ROOT / "tests/unit",
                ROOT / "tests/integration",
                ROOT / "tests/e2e",
            )
            missing_paths = [str(path.relative_to(ROOT)) for path in required_product_paths if not path.exists()]
            if missing_paths:
                failures.append("application delivery paths are missing: " + ", ".join(missing_paths))
            product_gate_summary = "configured (execute npm/database/browser gates separately)"

    if failures:
        print(f"CardStats verification: failing ({len(failures)} failure(s))")
        for failure in failures:
            print(f"- {failure}")
        return 1

    context_bytes = len(context.stdout.encode("utf-8"))
    print("CardStats verification: passing")
    print("- Harness script syntax: passed")
    print("- Manifest/state/handoff/link/budget/security checks: passed")
    print(f"- Compact context contract: passed ({context_bytes} bytes)")
    print("- Git whitespace check: passed")
    print(f"- Application delivery gates: {product_gate_summary}")
    print("- Product gate execution: recorded separately because database/browser access is external to this deterministic harness command")
    print("- Cross-client portability: not run; only the current Codex environment is available")
    return 0


raise SystemExit(main())
