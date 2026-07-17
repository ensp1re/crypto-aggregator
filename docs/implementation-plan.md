# Implementation plan

## Planning assumptions

This is a pre-code execution plan. A credible 16-week private-to-public beta assumes:

- two senior full-stack/data engineers;
- one product/design lead;
- one full-time data researcher/editor by week 3;
- fractional legal/privacy/security support;
- founder ownership of issuer discovery, partnerships, and customer research.

With one engineer, reduce launch coverage to 25–30 offerings or extend the schedule. Do not hold the same scope and simply reduce verification.

## Workstreams

1. **Product and research:** interviews, taxonomy, inclusion policy, gold records, methodology.
2. **Experience:** IA, prototypes, design system, accessibility, content language.
3. **Data platform:** schema, evidence model, projections, migrations, search.
4. **Research operations:** source registry, fetchers, artifacts, extraction, validation, review console.
5. **Public product:** browse, finder, comparison, detail/country pages, corrections.
6. **Trust/growth:** methodology, coverage, analytics, SEO, editorial/commercial policy.
7. **Reliability/security:** environments, observability, backups, threat model, QA, incident process.

## Phase 0 — foundations and falsification (weeks 1–2)

### Objectives

Prove the domain model on real programs and test whether users value evidence/eligibility enough to support the positioning.

### Activities

- Finalize inclusion, lifecycle, funding/custody, evidence, and critical-field taxonomies.
- Research ten gold-standard programs covering exchange debit, stablecoin, crypto-backed credit, self-custodial, multiple regions/tiers, paused status, and conflicting sources.
- Map brand, licensed issuer, program manager, processor, network, funding, and recourse for each.
- Conduct six initial interviews and two expert data-model reviews.
- Prototype country-first finder, result card, mobile comparison, evidence sheet, and program page.
- Run five usability sessions.
- Obtain legal advice on source collection, competitor discovery data, affiliate promotions, trademarks, artifact retention, and priority jurisdictions.
- Choose priority countries using demand, program density, regulatory risk, language, and research capacity.
- Write decision records for hosting/database, source rights, and ranking neutrality.

### Exit gate

Ten records can be represented without destructive flattening; users understand eligibility/cost/evidence; source acquisition is legally and operationally viable. Otherwise revise scope/model before development.

## Phase 1 — data and design foundation (weeks 3–5)

### Data

- Implement canonical organizations/programs/offerings/plans, geography, economic terms, sources/artifacts, claims, verification, change, jobs, and audit model.
- Define current-value projections and publication transaction.
- Create controlled vocabularies and gold fixtures.
- Establish source registry and manual evidence workflow before automation.

### Experience

- Finalize design tokens, typography, components, responsive behaviors, value-state language, and accessibility acceptance criteria.
- Test second prototype round with mobile comparison and scenario explanations.
- Create public methodology, editorial, coverage, correction, and affiliate policy drafts.

### Platform

- Establish local/preview/staging/production boundaries, migrations, CI quality gates, observability, secrets, backup/export, and synthetic seed philosophy.

### Exit gate

Researchers can manually create/review/publish ten records; public projections reproduce approved truth; backup restore and audit history work; core components pass keyboard/mobile review.

## Phase 2 — public decision experience (weeks 6–9)

- Build server-rendered catalog, search, filters, country context, and program/issuer pages.
- Build comparison tray and responsive comparison up to defined limits.
- Build five-step finder with hard eligibility filters and explained shortlist.
- Implement evidence sheet, source confirmation, explicit value states, and correction form.
- Add basic market/data-quality analytics and raw accessible tables.
- Establish canonical, sitemap, structured metadata, page-quality gates, and internal linking.
- Populate 25 verified programs in priority countries.
- Run weekly usability/accessibility sessions and instrument explicit events.

### Exit gate

Representative users correctly determine eligibility and lower-cost option in ≥80% of moderated tasks; no critical accessibility blockers; 25 programs meet publication gate; partner status is absent from rank inputs.

## Phase 3 — sustainable research operations (weeks 10–12)

- Add safe HTTP fetch, object artifacts, conditional requests, domain scheduling, retry/dead-letter, and parser fixtures.
- Add Playwright only for documented browser-only sources.
- Implement candidate extraction, normalized semantic diff, validation/anomaly rules, source conflicts, severity, and second review.
- Build research queue, safe artifact viewer, source locator, before/after diff, publication impact, and entity merge/split.
- Implement public change events, emergency status path, and cache revalidation outbox.
- Expand to 40–60 verified programs.
- Measure accepted-change precision and reviewer time.

### Exit gate

Critical change drill moves from source modification to reviewed public update and cache purge within target; malicious-source/SSRF tests pass; review queue is operationally manageable; launch coverage meets evidence/freshness thresholds.

## Phase 4 — hardening and private beta (weeks 13–14)

- Invite 50–100 testers across target countries/personas.
- Run accessibility audit, threat model review, penetration test, load/performance test, restore drill, crawler failure drill, and integrity incident tabletop.
- Validate country/legal copy with local reviewers.
- Reverify launch set and reconcile all critical conflicts.
- Test corrections and issuer contact with 5–10 programs.
- Establish on-call, incident, error/correction, and public status procedures.
- Validate analytics privacy and consent configuration.

### Exit gate

No open critical security/data issue; public freshness dashboard meets targets; p75 performance budgets pass; restore and emergency correction are demonstrated; beta comprehension and QDC meet thresholds.

## Phase 5 — public beta (weeks 15–16)

- Publish in a small set of countries first, then expand within launch set after monitoring.
- Release methodology, coverage, correction, editorial, affiliate, privacy, and legal pages with the product.
- Launch one original research report and change newsletter, not dozens of generic articles.
- Keep affiliate links disabled or limited until neutral ranking and disclosure tests are complete.
- Daily quality/queue review during launch; weekly user and issuer feedback review.
- Publish known limitations and near-term coverage plan.

## Post-beta: V1 sequencing

1. Fix eligibility/data-quality defects before adding coverage.
2. Add change alerts—the highest-retention feature.
3. Add scenario value model and tier break-even after gold calculations are validated.
4. Expand country/program coverage according to research capacity.
5. Add accounts/saved scenarios only when alerts need identity.
6. Pilot reviews in one or two markets after moderation/legal readiness.
7. Validate B2B feed needs manually before building API entitlements.

## Quality strategy

### Product/domain tests

Maintain reviewed golden cases for country exclusions, regional issuer split, explicit-zero versus unknown fee, tier/cap rewards, token haircut, stake capital cost, paused program, overlapping dates, conflicting official sources, and retroactive correction.

### Research-pipeline tests

Fixture replay, parser mutation, size/decompression limits, redirect/SSRF matrix, encoding/language, PDF table changes, mass-change quarantine, job idempotency, lease recovery, dead-letter handling, and atomic publication.

### Experience tests

375/768/1024/1440 layouts, keyboard-only, VoiceOver/NVDA, zoom/text spacing, reduced motion, contrast, slow network, JavaScript degradation, long names/currencies, RTL readiness, no/unknown/conflicting results, and comparison limits.

### Operational tests

Migration rehearsal/rollback-by-forward-fix, backup restore, source outage, database failover expectations, cache purge, credential rotation, correction surge, affiliate redirect failure, and analytics outage.

## Research operations

### Daily

Critical alerts, lifecycle/availability queue, source blocks, urgent corrections, stale-budget breaches.

### Weekly

Top-program re-verification, material fee/reward changes, source/parser health, conflict review, partner parity, user no-result queries.

### Monthly

Coverage census, long-tail review, entity relationship audit, quality report, search content prune/update, source rights review, and incident trends.

### Quarterly

Methodology/version review, restore and integrity drills, priority-country decision, user interviews, issuer panel, access review, monetization audit, and roadmap reprioritization.

## Team responsibilities

- **Founder/product:** strategy, priority markets, interviews, partnerships, neutrality and kill decisions.
- **Research lead:** inclusion, source hierarchy, verification playbook, publication quality, correction SLA.
- **Engineering lead:** architecture, data integrity, security, reliability, delivery.
- **Product designer:** decision flows, system, accessibility, user research, content patterns.
- **Growth/editorial:** original research, internal linking, distribution, disclosures; no authority over factual rank.
- **Legal/security advisors:** jurisdiction, collection rights, promotions, privacy, threat reviews.

One person may hold multiple roles, but approval separation for critical data and commercial/editorial conflicts remains.

## Build versus buy

Build the domain schema, publication workflow, finder, comparison, evidence UI, and research console. Buy managed database, hosting, object storage, authentication, email, product analytics, error monitoring, and scanning. Reassess when vendor cost exceeds the internal operational value.

## Decision log required before coding

- Priority countries and inclusion boundary.
- Critical fields by product type.
- Evidence-source hierarchy and publication gate.
- Program/offering/tier split rules.
- Ranking and effective-value model v0.
- Artifact rights/retention policy.
- Affiliate neutrality and financial-promotion review.
- Admin roles and two-person approval.
- Hosting region, processors, backups, and recovery objectives.
- Accessibility/browser support and performance budgets.
