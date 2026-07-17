# CardStats database design

## Core modeling decision

Never model “a card” as one mutable row. The same consumer brand may have different legal issuers, networks, card types, base currencies, fees, rewards, and availability by country and date.

The canonical hierarchy is:

```text
Issuer/brand
  -> Card program (consumer concept)
      -> Regional/legal offering
          -> Plan or tier
              -> Time-bound claims and evidence
```

This hierarchy prevents the category's most common data error: applying one market's maximum reward or fee to every user.

## Modeling principles

- Stable entities are separate from time-bound claims.
- Every material claim has scope, valid time, observation time, evidence, and status.
- Missing values have explicit semantics.
- Marketing brand and responsible legal entity are distinct.
- Money has amount, currency, percentage basis, and conditions—never an untyped string.
- Country rules distinguish residency, citizenship, delivery, use, and entity eligibility.
- History is append-only; corrections supersede rather than erase.
- JSON handles exceptional source conditions, not ordinary relational attributes.

## Entity map

### Organizations and relationships

**organizations**

Canonical companies, brands, banks, e-money institutions, processors, program managers, networks, custodians, and infrastructure providers. Fields: canonical name, aliases, organization type, jurisdiction, registry identifiers where verified, URLs, lifecycle, and editorial notes.

**organization_relationships**

Typed, time-bound edges such as `brand_owned_by`, `issued_by`, `program_managed_by`, `processed_by`, `networked_by`, `custodied_by`, and `settled_by`. Include offering scope, valid dates, evidence status, and confidence.

This graph supports accurate disclosures and future concentration analytics.

### Programs and offerings

**card_programs**

The consumer-facing product concept: canonical name/slug, owning brand, audience, summary, first observed, lifecycle, official canonical URL, and inclusion state.

**card_offerings**

A legally and operationally coherent regional variant. Fields include program, responsible entity, program manager, card form factors, debit/prepaid/credit/secured classification, funding/custody mode, settlement model, base currency, network, region label, and current lifecycle.

An offering must split when legal issuer, eligibility rule, fee schedule, network, card type, or settlement model materially differs.

**plans**

Subscription, stake, loyalty, or physical-card tiers belonging to an offering. Includes tier order, qualification model, and current lifecycle. A plan is not inferred from card color alone.

### Geography and eligibility

**countries**

ISO 3166 country code, names, region, currencies, and publication/localization settings.

**jurisdictions**

Regulatory or commercial groupings such as EEA, with versioned membership rather than a permanent comma-separated list.

**offering_eligibility_rules**

Offering, country/jurisdiction, eligibility dimension (`residency`, `citizenship`, `incorporation`, `delivery`, `usage`), outcome (`eligible`, `ineligible`, `waitlist`, `restricted`, `unknown`), user segment, conditions, exclusions, effective dates, and evidence claim.

Never infer residency eligibility from IP geolocation or generic shipping availability.

### Assets, chains, wallets, and funding

**assets**, **chains**, and **asset_chain_instances** normalize symbols and contract identifiers without assuming a symbol is unique.

**offering_funding_options** describes supported asset/chain, source wallet/account, auto-conversion, pre-fund requirement, collateral treatment, settlement asset, and priority order.

**wallet_integrations** records Apple Pay, Google Pay, and other wallets by offering, form factor, country, and validity period.

### Economics

**fee_definitions** defines controlled types: issuance, delivery, subscription, inactivity, top-up, crypto conversion, exchange spread, FX, ATM, replacement, decline, liquidation, early termination, and other.

**fee_terms** scopes a fee to offering/plan/country, with fixed amount, currency, rate, basis, minimum, maximum, free allowance, threshold, period, calculation notes, tax inclusion, valid dates, and claim reference. Spread should be represented as disclosed, estimated, or unknown—not silently folded into “FX fee.”

**reward_programs** defines reward asset/type and program-level mechanics.

**reward_terms** stores base and maximum rates, qualifying tier, spend category, cap amount/period, vesting, valuation method, valid dates, and claim reference.

**reward_exclusions** stores MCC or controlled category, geography, channel, and conditions. Raw issuer language is preserved as evidence; normalized exclusions support comparisons.

**limits** covers purchase, ATM, top-up, transfer, contactless, and balance limits with amount, currency, time window, verification tier, scope, and valid dates.

**benefit_definitions** and **offering_benefits** separate normalized benefits from issuer wording, conditions, frequency, user valuation eligibility, and time.

### Evidence and bitemporal claims

**sources**

Canonical origin URL, source owner, source type, authority tier, language, country scope, publication/effective date if stated, first/last fetched, content hash, HTTP metadata, robots/rights policy, artifact reference, and access status.

**source_artifacts**

Immutable fetch record: source, fetch time, content hash, object key, MIME, size, response metadata, parser version, and retention/right status. Binaries remain in private object storage.

**claims**

The normalized factual unit:

- subject type and ID;
- stable field path or claim type;
- normalized typed value and unit;
- offering/plan/country scope;
- `valid_from` / `valid_to`: when the fact applies in the world;
- `observed_at` / system revision: when the platform learned it;
- value state: known, not offered, not disclosed, not applicable, conflicting, stale;
- workflow state: candidate, verified, published, rejected, superseded;
- severity and reviewer metadata.

This bitemporal structure answers both “what were the terms on 1 March?” and “what did we believe on 1 March?”

**claim_evidence**

Many-to-many link from claim to source artifact with source locator (heading, table row, page, selector, or structured-data path), a short rights-safe excerpt or excerpt hash, extraction method, and support/contradict relationship.

**verification_events**

Actor, action, reason, checklist result, evidence coverage, timestamp, and previous/new claim revision.

**change_events**

Publicly understandable before/after change, effective/observed dates, severity, affected regions/plans, publication state, and notification eligibility.

**review_tasks**

Queue type, source/claim/subject, severity, assignee, due time, state, conflict group, and resolution.

### Users, corrections, and reviews

**users** and **admin_memberships** are minimal. Anonymous product use does not require a user row.

**saved_scenarios** stores explicit consented inputs, versioned calculator model, and a privacy-safe payload. Do not store wallet addresses or transaction history in the initial model.

**correction_submissions** stores submitter type/contact, claimed field, explanation, source attachments/links, abuse status, review task, disposition, and notification consent. Sensitive contact data has a separate retention policy.

**reviews** (V1 pilot) stores offering/region, structured experience dimensions, event date, proof status, incentive disclosure, conflict disclosure, moderation state, and edit history. Star scores alone are insufficient.

**affiliate_links** stores offering/region, partner, destination, commercial terms metadata, active dates, disclosure text, and link health. It is deliberately absent from ranking and core claim tables.

### Analytics and operations

**market_metric_snapshots** stores computed aggregate, coverage denominator, method version, period, dimensions, value, and quality notes.

**outbox_events** guarantees downstream revalidation, notifications, and analytical publication after database commits.

**jobs**, managed by the job library, and **audit_events** support operations. Audit records are append-only and retained separately from product history.

## Relationships and cardinality

```text
organization 1--N card_program
card_program 1--N card_offering
card_offering 1--N plan
card_offering N--N organization (typed, temporal relationships)
card_offering 1--N eligibility_rule / fee_term / limit / funding_option
plan 1--N reward_term / fee_term / benefit
any scoped subject 1--N claim
claim N--N source_artifact through claim_evidence
claim 1--N verification_event
published claim revision -> change_event -> outbox_event
```

## Current-value serving model

The public application should not reconstruct claim precedence on every request. Maintain transactionally refreshed projections:

- `current_offering_facts`
- `current_plan_economics`
- `country_offering_eligibility`
- `offering_evidence_summary`
- `search_documents`
- `program_change_summary`

Each row records the publication revision and oldest critical verification date. Projections are rebuildable from canonical claims and never independently edited.

## Constraints

- Slugs and official identifiers are unique within scope.
- Validity periods for mutually exclusive current claims cannot overlap unless state is `conflicting`.
- Monetary percentages have defined basis and reasonable bounds; validation exceptions require review.
- A published critical known claim requires at least one accepted evidence link.
- A verified “free” fee is an explicit zero, never null.
- Country codes, currencies, chain IDs, asset contracts, MCCs, and networks use controlled references.
- Every critical publication has an actor and verification event.
- Affiliate status cannot appear in rank calculation inputs.

## Index strategy

- Unique indexes on canonical slugs and external verified IDs.
- B-tree on `(subject_type, subject_id, field_path, valid_to)` and `(workflow_state, observed_at)`.
- Partial index for current published claims where `valid_to IS NULL`.
- Eligibility index on `(country_id, outcome, offering_id, valid_to)`.
- Fee/reward indexes on offering, plan, fee/reward type, and validity.
- GIN weighted full-text index on search documents; trigram indexes on names and aliases.
- Source index on normalized URL and content hash; artifact unique key on source/hash where policy allows deduplication.
- Review-task index on state, severity, due time, and assignee.
- Change-event index on publication time, program, severity, and region.
- Outbox partial index on unpublished events.

Do not add indexes speculatively to every foreign key/value. Use representative query plans and write-cost measurements.

## Partitioning and retention

Do not partition core tables at launch. Consider time partitioning artifacts metadata, audit events, market snapshots, and high-volume claims when individual tables approach tens of millions of rows or maintenance degrades.

Retention:

- Published factual history: indefinite unless legal correction requires special handling.
- Source artifacts: according to rights, security, and reproducibility policy; hashes/metadata can outlive bytes.
- Rejected extraction candidates: limited operational retention.
- Correction contact data and abuse metadata: minimized and time-limited.
- Admin audit logs: long-lived, access restricted.
- Product analytics: aggregate early and enforce a defined deletion window.

## Search semantics

Search ranks canonical/alias name, issuer, country, funding/custody terms, supported assets/chains, and benefits with controlled weights. It must not boost affiliate partners.

Facets use relational published facts. Unknown values are selectable and included in facet denominators. “No fee” means a verified explicit zero; unknown fees do not enter the free facet.

## Migration strategy

- Prisma Migrate orchestrates forward-only migrations; generated SQL is reviewed and customized for
  PostgreSQL-native constraints, partial indexes, extensions, views, data moves, and temporal rules.
- Never use `prisma db push` against shared, staging, or production databases.
- Rehearse migrations against production-like data and inspect query plans for complex Prisma,
  TypedSQL, and parameterized raw-SQL reads.
- Expand columns/tables, backfill in resumable batches, switch readers, then contract later.
- Never combine irreversible data transformation with a required zero-downtime deploy.
- Version calculator and normalization logic so historical outputs remain interpretable.
- Maintain gold-record fixtures representing region splits, conflicting sources, expired rewards, caps, and program closures.

## Open schema questions to resolve in Phase 0

1. Whether card network belongs only to offering or can vary by form factor inside one offering.
2. How to encode non-linear spreads and issuer exchange-rate formulas without unbounded JSON.
3. Whether jurisdiction groups need fully bitemporal membership for historical eligibility.
4. Which fields qualify as critical for publication by product type.
5. How source excerpt retention varies by jurisdiction and rights.
6. Whether a plan change creates a new plan or a time-bound claim revision.

Resolve these against ten real gold-standard programs before freezing the first schema.
