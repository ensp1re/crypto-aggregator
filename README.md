# CardStats

**CardStats** is a global crypto card analytics and comparison platform. This repository contains its pre-build blueprint; no product code has been written yet. CardStats is designed to help a person answer a deceptively hard question: **which crypto card can I actually obtain, what will it really cost, and what evidence supports those claims?**

Research snapshot: **17 July 2026**. Card terms, availability, regulations, and affiliate programs change frequently; links and market counts in these documents are observations, not permanent facts.

## Vision

Make the real eligibility, cost, rewards, custody model, and reliability of every crypto payment card understandable and auditable.

The platform should become the definitive data layer for crypto cards—not by claiming the largest count, but by maintaining the strongest provenance, regional precision, historical record, and correction process.

## Product principles

- **Evidence before ranking.** Important claims link to an official source, a precise source location, and a verification date.
- **Eligibility before excitement.** Residency, lifecycle status, card type, and funding model appear before headline rewards.
- **Unknown is not free.** Missing, conflicting, stale, and not-applicable values are distinct states.
- **“Best” is conditional.** Recommendations expose assumptions about spend, travel, ATM use, token value, staking, and risk.
- **Commercial neutrality.** Affiliate relationships never determine inclusion, scores, ordering, or corrections.
- **History is a feature.** Fee, reward, availability, issuer, and policy changes remain visible.
- **Editorial accountability.** Automation proposes changes; accountable humans publish material ones.

## Goals

1. Maintain a global, normalized catalog of live and publicly documented crypto card programs.
2. Make country and residency eligibility reliable enough to begin every discovery journey.
3. Compare effective cost and value rather than marketing headlines.
4. Expose field-level evidence, freshness, disagreements, and change history.
5. Give issuers and users a fair, logged correction process.
6. Build a sustainable data and affiliate business without selling rankings.

## Planned capabilities

The MVP targets 40–60 fully verified programs across 15–20 priority markets. It includes country-aware discovery, structured filters, a mobile-safe comparison experience, program and issuer profiles, fee/reward/limit detail, source evidence, change detection, a correction channel, and an internal research console.

Later releases add scenario-based value calculations, alerts and watchlists, country and use-case research pages, carefully moderated reviews, issuer submissions, a public data API, and licensed or independently produced market analytics. The complete scope and explicit exclusions are in [feature-roadmap.md](docs/feature-roadmap.md).

## Architecture overview

The recommended first architecture is a **TypeScript modular monolith with a separate ingestion worker**, not microservices:

- Next.js renders the public research experience and supplies a small REST/BFF layer.
- PostgreSQL is the system of record, search engine, temporal claim store, and initial job queue.
- A containerized worker fetches official sources, stores immutable artifacts, extracts candidate changes, and opens review tasks.
- A private admin area handles evidence review, conflicts, corrections, and atomic publication.
- Object storage retains source snapshots and screenshots; PostHog records an explicit, privacy-controlled product event model.

Redis, Elasticsearch, ClickHouse, GraphQL, Go services, and a generic CMS are intentionally deferred until measured constraints justify them. See [architecture.md](docs/architecture.md) and [tech-stack.md](docs/tech-stack.md).

## Technology choices

| Concern | Initial choice | Reason |
|---|---|---|
| Web | Next.js, React, TypeScript | Strong server rendering for SEO, client islands for comparison, one language across the team |
| UI | Tailwind CSS, owned shadcn/ui primitives, TanStack Table | Fast accessible composition without accepting a template aesthetic |
| Data/API | PostgreSQL, Drizzle, REST | Temporal relational data and transparent SQL matter more than abstraction |
| Search | PostgreSQL full-text + trigram | The initial corpus does not justify a separate search service |
| Jobs | pg-boss + PostgreSQL | Durable retries and scheduling without operating Redis |
| Collection | HTTP parsers first, Playwright fallback | Lower cost and fragility; browsers only where necessary |
| Hosting | Vercel web, Railway workers, Supabase Postgres, Cloudflare R2 | Each service has a narrow responsibility; revisit vendor count after beta |
| Product analytics | PostHog EU, explicit events | Funnels and experiments with redaction and consent controls |

These are recommendations, not procurement commitments. Decision criteria and exit thresholds are documented in [tech-stack.md](docs/tech-stack.md).

## Roadmap

- **Phase 0 — prove the taxonomy:** research operations, legal review, ten gold-standard records, user interviews, prototype testing.
- **MVP — prove trust and utility:** 40–60 verified programs, country discovery, comparison, evidence, admin review, and change monitoring.
- **V1 — prove retention:** broader coverage, calculators, alerts, accounts, deeper country pages, and a limited review pilot.
- **V2 — prove the data business:** issuer portal, B2B API, licensed/independent analytics, multilingual markets, and historical benchmarks.
- **Future — become infrastructure:** a shared crypto-card data standard, decision APIs, resilience indices, and auditable market intelligence.

Sequencing, gates, staffing assumptions, and success metrics are in [implementation-plan.md](docs/implementation-plan.md) and [milestones.md](docs/milestones.md).

## Setup philosophy

The eventual repository should provide a reproducible local environment, seeded with synthetic or license-safe fixtures—not copied competitor data. A new contributor should be able to run the web app, worker, PostgreSQL, and object-storage emulator with one documented workflow. Production credentials must never be needed locally. Migrations are forward-only, test data is deterministic, source fetches can be replayed from fixtures, and external calls are disabled by default in tests.

No setup instructions exist yet because this phase deliberately produces documentation only.

## Agent harness

The repository includes a portable, project-owned Core harness. Start every engineering session with
`python3 scripts/harness/context.py`, run `python3 scripts/harness/check.py` during work, and run
`python3 scripts/harness/verify.py` before review or handoff. [AGENTS.md](AGENTS.md) routes agents to
the authoritative product, architecture, security, live-state, and verification sources.

The harness remains pre-operational until the [product contract](docs/product-contract.md) and
[architecture baseline](docs/decisions/0001-architecture-baseline.md) are approved and the first
representative vertical slice is implemented and behaviorally exercised.

## Contribution philosophy

Contributions should preserve provenance and intellectual honesty. A data change needs evidence; a ranking change needs a published rationale; a schema change needs a migration and rollback plan; an affiliate change cannot alter editorial output. Material card-term changes require a second reviewer. Generated extraction suggestions are never treated as verified facts.

Architecture decision records should accompany irreversible choices. Product decisions should name the user problem, expected metric, guardrail, and evidence that would reverse the decision.

## Documentation map

- [Market research](docs/market-research.md) and [competitor analysis](docs/competitor-analysis.md)
- [Product contract](docs/product-contract.md), [product vision](docs/product-vision.md), [personas](docs/user-personas.md), and [feature roadmap](docs/feature-roadmap.md)
- [Technology](docs/tech-stack.md), [architecture](docs/architecture.md), and [database design](docs/database-design.md)
- [Architecture decision](docs/decisions/0001-architecture-baseline.md) and [verification contract](docs/verification.md)
- [Data pipeline](docs/data-pipeline.md), [analytics](docs/analytics.md), and [security](docs/security.md)
- [SEO](docs/seo-strategy.md), [monetization](docs/monetization.md), and [UI/UX](docs/ui-ux.md)
- [Implementation plan](docs/implementation-plan.md), [milestones](docs/milestones.md), and [risks](docs/risks.md)

## Important disclaimer

The product is a research and comparison service, not financial, tax, or legal advice. Card availability and terms must always be confirmed with the issuer before a user applies or deposits funds. The legal discussion in these documents identifies issues for qualified counsel; it is not legal advice.
