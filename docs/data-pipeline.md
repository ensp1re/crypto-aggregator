# CardStats data acquisition and verification pipeline

## Objective

Keep card data accurate without pretending automation can interpret every legal and commercial nuance. The pipeline turns untrusted source material into candidate claims, then into reviewed, scoped, historical facts.

The essential separation is:

```text
discovery != evidence
artifact != claim
extraction != verification
verification != publication
page freshness != field freshness
```

## Source strategy

### Authority hierarchy

| Tier | Source | Appropriate use |
|---|---|---|
| A | Cardholder agreement, fee schedule, legal disclosure, regulator/registry, official structured API | Primary evidence for legal issuer, fees, limits, eligibility, recourse |
| B | Official issuer help center and maintained product page | Primary/secondary evidence for current operations, rewards, wallet support |
| C | Written issuer confirmation attributable to an authorized contact | Clarification; publish with scope and attestation date |
| D | Network, licensed issuer, processor, or program-manager announcement | Entity relationship, launch, network, geographic context |
| E | Reputable independent reporting or research | Discovery, incident context, unresolved contradiction |
| F | Aggregator, community post, forum, search result | Discovery only until independently verified |

Legal terms generally outrank marketing. A newer official operational notice may legitimately supersede an older agreement for status but not rewrite contractual fees. Conflicts remain visible until scoped and resolved.

### Source registry

For each source record owner, domain, type, language, region, subjects/fields expected, fetch method, allowed schedule, robots outcome, access/rights notes, parser, authority tier, last success, next due, and escalation contact. No worker fetches arbitrary URLs supplied by a public form.

### Acquisition methods

1. Official APIs or structured issuer feeds, where licensed and stable.
2. Conditional HTTP fetch of HTML, JSON, RSS, and published documents.
3. Deterministic parsers for repeated page/fee-table families.
4. Browser rendering only when content cannot be obtained safely through HTTP.
5. Manual evidence capture for inaccessible, authenticated, region-gated, or ambiguous sources.
6. Direct issuer attestations, always reviewed and never privileged in ranking.

### Data-source landscape

**Official issuer websites and documents** are the primary MVP source. Product pages are best for discovery and current positioning; help centers for operational details; fee schedules/cardholder agreements for economics and legal scope; status pages for incidents; app-store release notes for supporting context. No single surface is complete.

**Official APIs and feeds** are preferable when an issuer or infrastructure provider offers documented terms, program status, or signed submissions with suitable redistribution rights. There is no observed universal public crypto-card terms API. Build a versioned issuer-submission format and treat API responses as source artifacts, not direct database writes.

**Public datasets** are currently fragmented. Network announcements, regulatory registries, public company filings, token/chain metadata, FX reference rates, and onchain ledgers can enrich relationships or calculations. They do not form an authoritative global card catalog. Onchain data cannot by itself establish retail eligibility, contractual fees, or final card spend. Paid products such as [Paymentscan's API](https://paymentscan.xyz/data-api) require a license and method reconciliation.

**Scraping opportunities** include static HTML tables, embedded structured JSON, sitemaps/RSS, help-center APIs, PDFs, and public status feeds. Static HTTP and deterministic parsing are the maintainable path; browser rendering is a narrow fallback. Search snippets, screenshots, and DOM position are discovery signals, not durable truth.

**Affiliate feeds** may provide destination URLs, creative, promotions, or commercial availability. They are not an editorial source of truth: feeds can omit nonpartners, lag legal terms, and optimize conversion. Store them in the commercial subsystem and independently verify every product claim.

**Community and correction data** are valuable early-warning signals. They open research tasks; they never silently overwrite canonical claims. Personal anecdotes are not market incidence estimates.

## CryptoAgg bootstrap assessment

### Feasibility

Technically, the visible [CryptoAgg](https://www.cryptoagg.io/) catalog could likely be enumerated and mapped into a seed JSON. Technically easy does not mean strategically sound. Its current model appears to flatten variants and emphasize marketing headline fields, so importing it would encode the wrong ontology before the first independent record exists.

### Legal and ethical risk

- Facts are not generally protected by copyright, but the selection, arrangement, prose, images, and creative presentation can be. The [US Copyright Office](https://www.copyright.gov/help/faq/faq-general.html) distinguishes facts from protected expression.
- The EU [Database Directive](https://eur-lex.europa.eu/legal-content/en/LSU/?uri=CELEX%3A31996L0009) may protect substantial database investment against extraction/reuse, including repeated extraction of insubstantial parts.
- Terms of service, access controls, contract, unfair-competition, trademark, and jurisdiction-specific rules require counsel. CryptoAgg's relevant policies could not be reliably retrieved during this research; that uncertainty increases, rather than removes, the need for permission.
- `robots.txt` expresses crawler preferences but is not authorization or a legal safe harbor; see [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html).

This is issue spotting, not legal advice.

### Recommendation

**Do not ship a CryptoAgg-derived dataset and do not use it as the primary bootstrap.** Use competitor listings only as private discovery checklists. Independently visit official issuer sources, build the correct entity model, and record original observations. Do not copy competitor prose, images, rankings, identifiers, layouts, or taxonomy.

If speed requires a one-time import:

1. Seek a written license or permission and qualified legal review.
2. Import only minimal factual discovery fields into a private quarantine table.
3. Retain `discovered_via`, import date, and rights basis.
4. Reverify 100% of critical fields from independent official sources before publication.
5. Deduplicate at program/offering level and reject unsupported status/reward claims.
6. Delete raw competitor material according to the approved retention policy.

The better MVP shortcut is ten gold records, then 40–60 priority programs researched directly. It is slower per first record and much faster than undoing a contaminated schema and trust failure.

## Pipeline stages

### 1. Discovery and triage

Sources: network/program-manager directories, issuer announcements, app/help centers, regulators, search, competitor discovery lists, user/issuer corrections. A candidate needs brand, likely official source, apparent lifecycle, target markets, and reason for inclusion.

Deduplicate against names, aliases, responsible entities, and existing regional offerings. Triage into live documented, waitlist/announced documented, paused/sunset, business, or insufficient evidence.

### 2. Safe fetch and artifact capture

- Verify registered HTTPS URL and allowed domain.
- Resolve DNS and block private/link-local/metadata ranges; repeat after every redirect.
- Apply domain concurrency, crawl delay, user-agent/contact, timeout, response-size, MIME, decompression, and redirect limits.
- Use conditional headers to avoid unnecessary transfers.
- Store response metadata, content hash, parser version, and immutable artifact when rights policy permits.
- Sanitize filenames and never render fetched active content in the admin origin.

### 3. Extraction

Parsers produce candidate facts plus locator and raw representation. Extraction can be deterministic selectors, structured data, PDF tables, or model-assisted suggestions. Each output includes parser/model version and confidence.

Language models may classify and propose mappings but must quote or locate their basis. They cannot invent missing scope, infer zero from absence, or publish.

### 4. Normalization

- Resolve program, offering, plan, organization, country, asset, chain, network, and currency identities.
- Convert dates, money, percentages, periods, caps, and units while retaining original text.
- Scope every term to country/jurisdiction, plan, user segment, and valid dates.
- Map marketing phrases into controlled funding/custody and lifecycle taxonomies.
- Preserve unmodeled conditions for review instead of forcing a lossy field.

### 5. Validation

Validation layers:

- syntactic: required types, currency/unit/date formats;
- domain: percentage and money bounds, cap periods, coherent lifecycle transitions;
- relational: referenced entities and offering/plan scope exist;
- temporal: non-overlapping mutually exclusive terms;
- completeness: critical fields or explicit unknown states;
- cross-source: conflicts, missing official evidence, marketing/legal mismatch;
- anomaly: implausible reward jumps, country-count changes, mass parser changes.

A valid value is not necessarily a true value; validation only gates obvious errors.

### 6. Semantic change detection

DOM/text hashes only determine whether to investigate. The diff engine compares normalized candidate claims to published claims:

- cosmetic: formatting or unrelated content;
- low: descriptive benefit wording;
- material: reward, limit, supported asset, wallet, or country change;
- critical: availability, responsible issuer, custody/funding, core fee, collateral/liquidation, legal status, or card type.

Large correlated changes from one parser revision are quarantined. Effective date and observation date are separate.

### 7. Verification and reconciliation

The reviewer sees old/new normalized values, source authority, precise artifact location, affected scopes, other supporting/contradicting sources, and downstream page/scenario impact.

Rules:

- Critical first publication and critical changes require a second reviewer.
- One strong Tier A source can be enough; two weaker sources do not automatically outrank it.
- Marketing claims that change economics require terms/cap evidence or a visible limitation.
- Conflicting official sources publish as conflicting when user harm would result from guessing.
- Issuer confirmations are attributable and expire into normal re-verification.

### 8. Atomic publication

Close/supersede prior claims, insert reviewed revisions, verification events, public change event, projection updates, and outbox records in one transaction. Revalidate affected pages and send alerts from the committed outbox.

### 9. Monitoring and re-verification

Risk-based default cadence:

| Subject | Automated check | Human freshness target |
|---|---|---|
| Availability, outages, issuer relationship | Daily for top set | 7 days top 20; 14 days launch set |
| Core fees, conversion, rewards, caps | 2–7 days | 7–14 days |
| Countries and wallet support | Weekly | 14 days |
| Limits and benefits | Weekly–monthly | 30 days |
| Stable identity/network history | Monthly | 90 days |
| Long-tail paused/sunset | Monthly–quarterly | On change |

Any source hash change, correction, incident, or issuer notice overrides cadence.

## Publication gates

An offering can appear as verified only when:

- inclusion and lifecycle are documented;
- legal/responsible issuer is known or prominently disclosed unknown;
- residency scope is verified;
- card type and funding/custody model are scoped;
- core fee, reward, limit, and conversion fields meet completeness policy;
- every critical known fact has accepted official evidence;
- no unresolved critical conflict is hidden;
- freshness SLA is met.

Incomplete products can appear in a clearly separate research/watchlist state, not in eligible recommendations.

## Data quality metrics

- Critical evidence coverage by source tier.
- Critical freshness coverage and stale-claim budget.
- Field completeness by value state—not null percentage alone.
- Confirmed correction rate and root cause.
- Source contradiction rate and age.
- Time to detect, review, and publish by severity.
- Parser precision on reviewed candidates.
- Source fetch success/block rate.
- Review backlog age and second-review latency.
- Program/offer duplication and entity-merge reversals.
- Partner vs nonpartner quality parity.

Publish selected metrics on a coverage page. Internal targets should include: ≥90% authoritative evidence for critical MVP claims, zero critical claims knowingly shown as verified during unresolved conflict, and <24-hour detection for monitored critical source changes.

## Corrections and issuer participation

Corrections are free. Require field, current displayed value, proposed value, affected region/plan, effective date, and evidence. Issuer submissions are labeled, identity-checked when possible, and reviewed under the same hierarchy. Log decisions and let submitters appeal with new evidence.

Never allow an issuer to suppress a documented unfavorable fee, incident, or user report as a condition of partnership.

## Maintainability

- Prefer a source-family parser over a brittle selector for every page.
- Store parser fixtures and replay them without network access.
- Track source ownership; no orphaned source enters the top tier.
- Version normalizers and calculators.
- Budget research hours per offering and retire low-value coverage when maintenance exceeds benefit.
- Measure automation by accepted precise changes and reviewer time saved, not pages fetched.

## Legal and rights checklist

Before adding a source: review terms, robots, copyright/database rights, authentication, rate limits, personal data, document retention, attribution, and intended republication. Obtain licenses for paid/proprietary datasets. Avoid personal data in public pages and artifacts; public availability does not remove privacy obligations, as privacy regulators note in the [joint data-scraping statement](https://ico.org.uk/media2/migrated/4026232/joint-statement-data-scraping-202308.pdf).
