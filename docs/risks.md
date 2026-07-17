# CardStats risk register

## Executive view

The existential risk is not a competitor feature. It is publishing financially consequential data that appears authoritative but is stale, wrongly scoped, or commercially biased. The next largest risks are unsustainable research cost, source/legal restrictions, program volatility, and acquisition concentration.

Scores: likelihood and impact from 1 (low) to 5 (critical). Residual scores must be reviewed quarterly and after incidents.

## Top risks

| ID | Risk | L | I | Early signal | Primary mitigation | Owner |
|---|---|---:|---:|---|---|---|
| R1 | Incorrect/stale critical claim harms user | 4 | 5 | Corrections, conflicts, stale budget | Field evidence, risk cadence, two-person critical review, visible uncertainty | Research lead |
| R2 | “One card” modeling corrupts regional truth | 4 | 5 | Exceptions/contradictory terms | Program→offering→plan temporal model; ten gold records | Eng + research |
| R3 | Research operations do not scale | 4 | 5 | Backlog age/cost per offering rises | Priority coverage, source-family automation, retire low-value tail | Founder |
| R4 | Scraping/database-rights or ToS claim | 3 | 5 | Blocks, takedown, counsel concern | Official sources, rights registry, permission/license, minimal artifacts | Legal |
| R5 | Affiliate conflict destroys trust | 3 | 5 | Partner freshness/rank disparity | Structural table/code separation, parity audits, disclosure | Founder |
| R6 | Regulatory/financial-promotion breach | 3 | 5 | Geo-specific warnings, regulator inquiry | Jurisdiction review, fair/clear copy, controlled targeting/links | Legal |
| R7 | Admin/source compromise alters data | 3 | 5 | Unusual publication or login | MFA/passkeys, RBAC, two-person approval, immutable audit | Eng |
| R8 | Scraper SSRF/malicious content compromise | 3 | 5 | Unexpected egress/parser crash | Allowlists, network egress, isolation, limits, patching | Eng |
| R9 | Card programs close/change rapidly | 5 | 4 | Source/status changes, user reports | Lifecycle model, daily monitors, emergency update, alerts | Research |
| R10 | SEO/AI answer systems reduce distribution | 4 | 4 | Impressions/clicks/QDC fall | Direct alerts, original data, tools, API, community, brand | Growth |
| R11 | “Best” model creates false precision | 4 | 4 | Users misunderstand assumptions | Hard filters, ranges, dimension scores, explainability, none option | Product |
| R12 | Competitor bootstrap imports errors/IP | 3 | 4 | Untraceable fields, copied phrases | No shipped import; licensed quarantine + 100% independent verification | Research |
| R13 | Review fraud/manipulation | 4 | 4 | Bursts, sentiment incentives, threats | Delay; proof, disclosure, moderation, anti-fraud, appeals | Trust |
| R14 | Vendor outage/lock-in/multi-vendor latency | 3 | 3 | connection issues, incidents, cost | Portable containers/Postgres/S3, region tests, restore/export | Eng |
| R15 | Weak monetization / volatile affiliates | 4 | 4 | low approvals, program closure | Low fixed cost, B2B validation, diversified issuers/channels | Founder |
| R16 | Tax/legal content interpreted as advice | 3 | 4 | user reliance/complaints | Authoritative links, scope, local review, no individualized result | Product/legal |
| R17 | Privacy/analytics overcollection | 2 | 4 | sensitive event payloads | Minimize, explicit events, consent/retention, replay off | Privacy |
| R18 | Data/API customer relies beyond warranty | 3 | 4 | SLA/error disputes | Provenance, versioning, contracts, error policy, staged beta | Founder/legal |

## Detailed risk treatments

### R1/R2 — accuracy and scope

**Failure scenario:** A headline fee/reward from one region is shown to another, or a paused program remains recommended.

**Controls:** scoped claims, explicit unknown/conflict states, source hierarchy, evidence coverage, material-change alerts, publication gates, second review, current projections, correction ledger, and emergency cache purge.

**Contingency:** withdraw affected recommendation, label incident, preserve/correct history, notify subscribers and material API customers, audit sibling claims from the same source/parser.

**Kill criterion:** if critical confirmed error rate remains above 1 per 1,000 critical claims for two quarters despite reduced coverage, stop expansion and reassess the business.

### R3 — operational scalability

**Failure scenario:** Each new card creates bespoke parsers, region research, and legal interpretation; freshness collapses.

**Controls:** coverage tiers, risk cadence, source ownership, reusable parsers, gold fixtures, review-time metrics, issuer feeds, public completeness denominator, and explicit long-tail deferral.

**Contingency:** shrink supported countries/programs, label research-only records, charge B2B for costly specialized coverage, and sunset low-demand records responsibly.

### R4/R12 — collection rights and competitor data

**Failure scenario:** A competitor or issuer alleges copied database/prose/artwork or unauthorized access.

**Controls:** original schema, official-source research, no competitor public import, rights notes per source, rate/robots compliance, counsel review, licenses, content hashes and lineage, minimal excerpt/artifact retention.

**Contingency:** suspend source/records, preserve internal evidence, comply with lawful takedown, replace with licensed/independent data, notify customers if coverage changes.

### R5 — commercial bias

**Failure scenario:** Partnerships influence coverage, default sort, editorial wording, or correction speed.

**Controls:** research/commercial ownership separation, isolated affiliate tables, code tests preventing rank access, direct official links, nonpartner parity dashboard, staff incentives, public policy and audit.

**Contingency:** remove affected placement/ranking, disclose incident, rerun decisions, pause partner, independent review.

### R6/R16 — regulation, promotions, and advice

**Failure scenario:** Comparison copy or affiliate actions are regulated promotions, or a user treats a modeled tax/economic result as advice.

**Controls:** priority-market counsel, geo-aware disclosures/link rules, factual language, explicit assumptions, risk notices near CTAs, no guaranteed/safe claims, authoritative tax links, approval workflow for country editorial.

**Contingency:** disable affected market content/links, retain neutral factual database where lawful, revise with counsel, notify partners/users as required.

### R7/R8 — integrity and scraper security

**Failure scenario:** Compromised admin publishes altered terms, or a hostile source reaches internal infrastructure.

**Controls:** separate roles, phishing-resistant MFA, re-authentication, two-person critical actions, immutable audit, anomaly detection, egress allowlists, IP/redirect validation, sandboxed parsers/browser, dependency patching.

**Contingency:** revoke sessions/secrets, isolate workers, freeze publication, restore verified projections, assess artifact/database access, communicate material integrity corrections.

### R9 — program volatility

**Failure scenario:** An issuer changes processor, pauses applications, cuts rewards, or closes with little warning.

**Controls:** lifecycle states, source/incident monitors, corrections, issuer contacts, daily top-set cadence, public history, alerting, and “confirm at issuer” action.

**Contingency:** emergency status update, suppress recommendation/affiliate action, show alternatives, notify watchers.

### R10 — distribution concentration

**Failure scenario:** Search ranking or AI answers reduce visits while copying summaries.

**Controls:** original live tools/data, alerts, newsletter, saved scenarios, citations/public research, community corrections, issuer/network relationships, APIs/widgets, brand queries, diversified content formats.

**Contingency:** reallocate from page production to direct/community/B2B distribution; reduce SEO-dependent cost; license data into answer surfaces.

### R11 — false precision

**Failure scenario:** Users assume a result is universally best or a trust band means safe.

**Controls:** eligibility hard filters, ranges, assumptions, dimension-specific evidence, excluded alternatives, no-result outcome, comprehension testing, no universal star score.

**Contingency:** remove or simplify score, strengthen scenario presentation, retest understanding before restoring.

### R13 — review fraud

**Failure scenario:** issuers buy positives, competitors post negatives, or moderation suppresses criticism.

**Controls:** reviews deferred to V1; proof/region/date, incentives and insider disclosure, account/rate anomaly detection, no positive-only rewards, transparent moderation and appeals, FTC/local review-law process.

**Contingency:** quarantine affected cohort, remove aggregate scores, preserve evidence, disclose manipulation, suspend review feature if integrity cannot be maintained.

### R14 — infrastructure

**Failure scenario:** cross-vendor database latency, vendor outage, pricing increase, or unrecoverable data.

**Controls:** co-located EU regions, pooling/load tests, standard PostgreSQL/container/S3 interfaces, offsite backups, export drills, last-known public rendering, vendor exit runbook.

**Contingency:** consolidate web/worker on Railway or move Postgres-compatible provider; degrade analytics/admin rather than public facts.

### R15/R18 — business model and liability

**Failure scenario:** affiliate conversion is too small/volatile; data customer demands exceed readiness.

**Controls:** validate unit economics after research cost, multiple programs, direct audience, manual B2B design partners, limited beta, rights matrix, provenance/versioning, clear contracts and error SLA.

**Contingency:** narrow to professional data product, reduce consumer expansion, or operate as a smaller research business. Do not compensate with biased rankings.

## Assumption register

Validate these before irreversible investment:

| Assumption | Test | Evidence needed |
|---|---|---|
| Users value evidence, not just reward rate | Prototype/behavior | Evidence interactions improve comprehension/QDC |
| 40–60 programs cover meaningful demand | Search/interviews/issuer data | Most target decisions fall within set |
| Official sources can support critical fields | Ten then 40 gold records | ≥90% Tier A/B evidence coverage |
| Research can scale economically | Time tracking | Stable hours per maintained offering |
| Country-first improves outcomes | Controlled usability | Fewer eligibility errors than browse-first |
| Alerts create retention | V1 cohort | Meaningful four-week return/engagement |
| Affiliate revenue does not require bias | Partner tests | Neutral inventory plus viable conversion |
| B2B buyers need normalized changes | Design partners | Three recurring integrations/commitments |
| Postgres handles early analytics/search | Load tests | p95 within budgets without harmful contention |

## Risk review process

Weekly: R1, R3, R7–R9 and launch blockers. Monthly: full operational/commercial dashboard. Quarterly: rescore all risks, review controls and incidents, add emerging jurisdictions/providers, and publish material methodology changes. Any integrity or legal incident triggers an immediate review.

The founder owns the register. Individual owners execute controls; nobody owns away the company's accountability.
