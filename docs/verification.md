# CardStats harness and delivery verification

## Commands

- Compact startup context: `python3 scripts/harness/context.py`
- Fast deterministic check: `python3 scripts/harness/check.py`
- Full current-repository verification: `python3 scripts/harness/verify.py`

The scripts use only Python's standard library and Git. They do not install dependencies, access the
network, execute hooks, upload data, or mutate project files.

## Current verification hierarchy

| Level | Current gate | Current status |
| --- | --- | --- |
| Formatting/lint | `npm run lint`, `git diff --check` | Applicable |
| Type/schema | `npm run typecheck`, `npx prisma validate`, reviewed migration SQL | Applicable |
| Unit tests | `npm run test -- tests/unit` | Applicable |
| Integration/contract | `npm run test -- tests/integration` against the dedicated development database | Applicable; external database access required |
| Build/package | `npm run build` | Applicable; Turbopack may require local worker-port permission |
| End-to-end journey | `npm run test:e2e` | Applicable; local port, browser, and development database access required |
| Accessibility/responsive | Playwright + axe, 375px, landscape, 200% text, reduced motion, touch targets | Applicable; manual VoiceOver/NVDA still not run |
| Security/policy | Harness secret scan, `npm audit`, publication policy/unit/integration assertions | Applicable; production threat/operations gates remain later |
| Migration/data | `npm run db:migrate`, `npm run db:seed`, `npx prisma migrate status` | Development only; destructive seed must never target production |
| Delivery gate | Product gates above, `python3 scripts/harness/verify.py`, complete diff review, current handoff | Applicable; CI/PR not configured |

The deterministic Python harness does not install dependencies, open network connections, mutate the
database, start a browser, or bind application ports. It verifies that application gates are routed and
that their results are recorded in current handoff evidence. Run the native npm/database/browser gates
explicitly before review; never treat their presence as a pass.

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
