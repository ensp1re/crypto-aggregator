#!/usr/bin/env python3
"""Run the complete verification currently applicable to the pre-code CardStats repository."""

import ast
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
    print(
        "- Product build, unit/integration/E2E, deployment, and CI: not applicable; "
        "no product code or delivery configuration exists"
    )
    print("- Cross-client portability: not run; only the current Codex environment is available")
    return 0


raise SystemExit(main())
