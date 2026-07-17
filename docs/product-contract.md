# CardStats product contract

Status: **approval required before product implementation**

Owner: repository owner / founder

Baseline date: 17 July 2026

This contract consolidates the implementation-changing decisions already documented across the
blueprint. Detailed strategy remains in [product-vision.md](product-vision.md), roadmap scope in
[feature-roadmap.md](feature-roadmap.md), and delivery sequencing in
[implementation-plan.md](implementation-plan.md).

## Purpose and outcome

CardStats helps a person determine which crypto payment cards they can actually obtain, what those
cards will cost under their behavior, how rewards and funding work, and what current evidence
supports each claim. A successful decision can be a selected card or a well-supported conclusion
that none is suitable.

## Users and permissions

| User | First-release outcome | Permission boundary |
| --- | --- | --- |
| Anonymous consumer | Browse, filter, compare, run a local/session finder, inspect evidence, and submit a correction | Reads only published projections; cannot publish or access private artifacts |
| Researcher | Register sources, enter or review candidate facts, and resolve routine conflicts | Cannot self-approve critical changes |
| Senior verifier/publisher | Approve scoped claims and publish reviewed revisions | MFA, re-authentication, RBAC, and audit trail required |
| Administrator | Manage roles and exceptional entity operations | Default deny; destructive actions require stronger approval and audit |
| Commercial operator | Manage disclosed partner metadata | Cannot influence factual coverage, economics, or ranking inputs |

Business/API customers, issuer workspaces, saved consumer accounts, and user reviews are later
releases, not first-slice assumptions.

## Principal journeys

1. **Country-first discovery:** choose residency, see only scoped eligible/live offerings, filter by
   funding and use case, and understand why results were included or excluded.
2. **Comparison:** compare up to four offerings on desktop or three on mobile across real fees,
   attainable rewards, limits, funding/custody, availability, evidence, and value-state uncertainty.
3. **Evidence inspection:** open a critical claim, view its authoritative source, scope, observation
   and verification dates, and confirm important terms with the issuer.
4. **Correction:** submit a suspected error, which enters moderation and research review without
   directly mutating published truth.
5. **Research publication:** register an allowlisted source, capture an artifact, normalize candidate
   claims, validate and review changes, then atomically publish an auditable revision.

## MVP scope

- Responsive English web product covering 40–60 verified consumer programs and 15–20 approved
  priority countries.
- Program, legal/regional offering, and tier modeling; country/residency eligibility; lifecycle;
  funding/custody; fees, rewards, limits, benefits, and evidence.
- Server-rendered browse, search, country, issuer, program, finder, and comparison experiences.
- Explicit `known`, `not_offered`, `not_disclosed`, `not_applicable`, `conflicting`, and `stale`
  states rather than blanks or inferred zeroes.
- Internal source registry, manual review console, scheduled safe collection, candidate validation,
  semantic change detection, and reviewed publication.
- Public methodology, coverage, correction, editorial, and affiliate disclosures.

The detailed MVP publication gates in [feature-roadmap.md](feature-roadmap.md) are normative.

## Explicit exclusions through V1

No card issuance, custody, application brokering, fund movement, wallet connection, native mobile
app, individualized tax/legal/financial advice, universal safety score, anonymous star reviews,
automatic publication of critical extracted terms, paid verification, sponsored ranking, or thin
programmatic SEO. Do not add Redis, ClickHouse, Elasticsearch, GraphQL, Go services, microservices,
or Kubernetes without a measured trigger and an approved ADR.

## Core domain and ownership

The system distinguishes organization, card program, regional/legal offering, plan/tier, country
eligibility, network, asset, chain, funding/custody model, fee, reward rule, benefit, source artifact,
scoped claim, verification, publication, and historical change. “Card” is not one mutable row.

PostgreSQL owns canonical entities, temporal claims, workflow, audit history, jobs, and published
read projections. Private object storage owns immutable source binaries. Public analytics may read
published claims but behavioral analytics never becomes card truth.

## Trust, privacy, and destructive actions

- Official agreements, fee schedules, and issuer/regulatory sources outrank marketing and third-party
  summaries; all remote content remains untrusted input.
- Public requests never trigger scraping. Collection workers use registered HTTPS origins, SSRF
  defenses, bounded resources, isolated parsers/browsers, and separate credentials.
- Critical publication uses two-person approval. Corrections append revisions; audit history is not
  destructively rewritten.
- Anonymous discovery requires no account. Do not collect wallet addresses, balances, transactions,
  identity documents, or precise location for MVP.
- Entity merge/split, role changes, exports, and critical publication require re-authentication,
  reason capture, audit evidence, and a tested recovery or forward-correction path.

The complete mandatory threat model is [security.md](security.md).

## Runtime and operational constraints

- Web request plane: indexable, accessible Next.js application and BFF reading published projections.
- Research plane: separately deployed scheduler and TypeScript worker; browser work is isolated from
  lightweight HTTP collection.
- Initial scale: sub-thousand offering catalog, 40–60 launch programs, and low-to-moderate scheduled
  collection volume; optimize PostgreSQL and CDN caching before specialized stores.
- Public beta targets: 99.9% monthly read availability, p75 LCP under 2.5 seconds, p95 cached catalog
  response under 500 ms, and top-program critical change detection within 24 hours.
- Local and preview environments use synthetic/license-safe data and no production source secrets.
- Migrations, backups, restore, emergency correction, cache purge, and source-outage behavior must be
  exercised before public beta.

## Observable first-release acceptance

- At least 90% of critical launch claims have Tier A/B official evidence; every remaining critical
  value is explicitly qualified.
- Representative users correctly determine eligibility and the lower-cost option in at least 80% of
  moderated tasks.
- A 375px user can compare three offerings without a compressed horizontal table.
- No critical accessibility, security, integrity, or unresolved verified-data conflict remains.
- Partner status is absent from ranking inputs and partner/nonpartner parity is audited.
- Publication, source outage, restore, emergency correction, and malicious-source drills pass.

## First representative vertical slice

Implement only after this contract and the architecture ADR are approved. Model one program with two
regional offerings and two tiers from license-safe official-source fixtures. A researcher must be able
to create scoped candidate claims, attach evidence, review and publish them, and produce an indexable
public detail page whose country eligibility and value states are correct. The same published data
must drive a two-offering comparison. Acceptance requires domain/unit tests, database publication and
authorization integration tests, one browser journey, accessibility checks, and an audit-history
assertion. Scraping, accounts, affiliates, and production infrastructure are excluded from this slice.

## Decisions required before coding

The founder must explicitly approve or revise these items; current recommendations are not silent
authorization:

1. priority countries and catalog inclusion boundary;
2. critical fields and program/offering/tier split rules;
3. evidence hierarchy, publication gate, and artifact rights/retention;
4. ranking/effective-value model v0 and affiliate-neutrality controls;
5. admin roles, two-person approval, and privileged/destructive actions;
6. architecture and stack in [ADR 0001](decisions/0001-architecture-baseline.md);
7. hosting region, processors, recovery objectives, and backup ownership;
8. accessibility, browser support, and performance budgets;
9. first-slice acceptance criteria above;
10. legal review scope for collection, promotions, trademarks, and initial jurisdictions.
