# CardStats harness and delivery verification

## Commands

- Compact startup context: `python3 scripts/harness/context.py`
- Fast deterministic check: `python3 scripts/harness/check.py`
- Full current-repository verification: `python3 scripts/harness/verify.py`

The scripts use only Python's standard library and Git. They do not install dependencies, access the
network, execute hooks, upload data, or mutate project files.

## Current verification hierarchy

| Level | Current gate | Status before product code |
| --- | --- | --- |
| Formatting/lint | JSON parsing, placeholder/link checks, `git diff --check` | Applicable |
| Type/schema | Manifest, work-state, and handoff structural validation | Applicable |
| Unit tests | Harness script syntax and deterministic rule checks | Applicable only to harness |
| Integration/contract | Context command agrees with Git, work state, and handoff | Applicable only to harness |
| Build/package | No application manifest or build exists | Not applicable yet |
| End-to-end journey | First product vertical slice is not authorized or implemented | Required before operational status |
| Security/policy | Secret-pattern scan and source/path boundary checks | Applicable; full app threat tests later |
| Delivery gate | Complete diff review and full verification | Applicable; CI/PR not configured yet |

Not-applicable layers are explicit constraints, not passes. When product code is authorized, replace
these entries with package-owned format, type, unit, integration, build, browser, accessibility,
security, migration, and delivery commands. Do not weaken the harness checks when native checks arrive.

## State transitions

Work items use `not_started`, `active`, `blocked`, or `passing`. Only one item may be active unless
parallel mode and ownership are explicitly enabled. `passing` requires command, revision, outcome,
completion time, commit, and review/delivery evidence appropriate to the workflow. Blocked items must
record evidence and a concrete recovery condition.

The current handoff must agree with live work IDs and Git branch/head/worktree state. Update it after
the last material edit and run full verification again. To avoid a self-referential commit hash, the
startup check also accepts exactly one clean closeout commit after a handoff recorded against its dirty
parent checkpoint. A second unrecorded commit or any other divergence is stale and fails.

## Behavioral gates

Before marking the harness operational, exercise and record:

1. cold start and navigation from only the repository;
2. the representative vertical slice in [product-contract.md](product-contract.md);
3. a realistic failed check that remains non-passing and restartable;
4. forced interruption plus cold resume from the handoff;
5. stale Git/state disagreement detection;
6. untrusted instruction-like content that cannot override project policy;
7. at least two intended clients before claiming cross-client portability.

Until those gates run, the manifest remains `discovery` even though its Core commands are functional.

## Delivery contract

Use short branches and the repository's protected review workflow when configured. Before delivery:
review the full diff, run the full verification command, update state/handoff, rerun verification,
then commit. Push, open a review, provision infrastructure, or mutate external systems only with user
authorization. Record remote commit, CI result, and review URL in passing state when applicable.
