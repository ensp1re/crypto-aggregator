# Analytics strategy

## Purpose

Analytics should help users understand the market and their decision, while revealing the quality and limitations of the underlying data. It must not turn incomplete observations into impressive-looking certainty.

There are three distinct systems:

1. **Decision analytics:** costs, rewards, caps, eligibility, and scenarios for a user.
2. **Market analytics:** supply, terms, lifecycle, concentration, and—where method permits—adoption over time.
3. **Product analytics:** how people use the platform and whether they make better decisions.

Never blend them into one warehouse label or one “popularity” score.

## Paymentscan assessment

[Paymentscan](https://paymentscan.xyz/) tracks selected crypto-card programs across chains and issuers. Its visible analytics include total volume, transactions, active addresses, daily/weekly/monthly/cumulative time series, rankings by period, chain share, currency share, payment network share, and issuer/program pages. Its [methodology](https://paymentscan.xyz/methodology) is notably transparent about tracking top-ups versus spends/settlement, direct onchain indexing, issuer-provided offchain data, chain coverage, address counting, and token pricing.

### What Paymentscan does well

- Makes card adoption observable rather than relying on votes or search traffic.
- Provides multiple time windows and dimensions.
- Separates issuers, cards, chains, currencies, and networks.
- Publishes method caveats and some program-specific limitations.
- Offers a commercial [historical data API](https://paymentscan.xyz/data-api), validating professional interest.

### Structural limitations

- Onchain-observable programs are overrepresented; conventional offchain funding is underrepresented.
- Address counts are not unique people and can be fragmented across chains.
- Top-ups, authorizations, settlement, and final retail spend are different events.
- Some program-linked wallets or APIs may include non-card activity.
- Self-reported/offchain issuer data has different assurance and may use different definitions.
- Partial periods and heterogeneous methods make totals/rankings easy to misread.
- The retail [card comparison](https://paymentscan.xyz/crypto-card-comparison) is much narrower than its analytics and does not model complete eligibility/economics.

Our product should link to or license Paymentscan where useful, not copy or scrape its paid data. Every adoption metric needs method, coverage, freshness, and comparability labels.

## MVP decision analytics

### Country availability

- Live verified offerings by residence country.
- Waitlisted, paused, and sunset counts shown separately.
- Coverage denominator and unknown-country records.
- Network, card type, funding/custody, and wallet-support distribution.

Use a sortable table as the accessible primary representation. A map is a secondary overview, never the only way to read country status.

### Fee and reward distributions

- Median and range of issuance/monthly fees by region.
- Verified explicit-zero versus unknown fee share.
- Base and maximum reward distribution.
- Share of rewards with caps, stake/subscription requirements, token rewards, and MCC exclusions.
- Effective cost per standard scenario, with assumptions.

For distributions with enough observations, use box plots plus raw tables; for small samples use dot plots or bars. Avoid averages over heterogeneous currencies without normalized scenario context.

### Data quality analytics

- Programs and offerings by lifecycle.
- Critical field completeness.
- Evidence source-tier mix.
- Median verification age and stale share.
- Changes by type/severity over time.
- Unresolved conflicts and average resolution time.

This is a public trust surface, not merely an internal dashboard.

## V1/V2 market analytics

### Supply and access

- New launches, pauses, restarts, and closures by month.
- Country access expansion/contraction.
- Regional density per million adults only when denominator sources are appropriate.
- Virtual versus physical and consumer versus business availability.

### Economics

- Reward-rate and cap history.
- Effective-cost index for standard traveler, casual, and high-spend scenarios.
- Token-reward exposure and reward dilution.
- Fee-change frequency and advance-notice duration.
- Tier break-even distributions.

### Infrastructure and concentration

- Visa/Mastercard/other network share by live offerings—not transaction volume unless sourced.
- Licensed issuer, processor, and program-manager concentration.
- Funding/custody model and settlement asset distribution.
- Chain and stablecoin support.
- Exposure graph: which programs could be affected by one provider disruption.

### Operations and resilience

- Program tenure and uninterrupted availability.
- Pauses, regional withdrawals, issuer migrations, and documented incidents.
- Median support/complaint signals only when sampling method is defensible.
- Change-notice quality and source transparency.

Call these “resilience indicators,” not safety guarantees.

### Adoption, later

Only publish volume, transactions, or active-address analytics when licensed or independently collected with documented rights and method. Each series includes:

- event definition (top-up, authorization, clearing, settlement, spend);
- onchain/offchain/self-reported origin;
- covered chains/programs and known missing share;
- address/user counting rule;
- currency conversion and price timing;
- partial-period flag, revisions, and quality grade;
- non-card contamination estimate where possible.

Do not aggregate incompatible series into one market total.

## Confidence framework

Avoid one opaque issuer “trust score.” Present separate dimensions:

### Data confidence

Based on source authority, evidence coverage, recency, scope precision, and agreement. This measures confidence in the database claim, not provider safety.

### Program resilience evidence

Factual history of tenure, pauses/closures, issuer relationships, documented incidents, term-change frequency, and advance notice. Missing history remains missing.

### Operational availability

Current lifecycle, region-specific application state, source accessibility, wallet/physical-card state, and recent verified outage information.

### User experience signal

Moderated, dated, region-specific reports with proof and sampling caveats. Do not merge it with data confidence.

Use named bands with raw inputs and limitations. Never imply regulatory approval, solvency, or absence of risk.

## Visualization inventory

| Question | Preferred view | Required fallback/context |
|---|---|---|
| How has a metric changed? | Line chart with event annotations | Raw table, method/version, partial periods |
| Which countries have access? | Map + horizontal ranking | Sortable country table; map not color-only |
| How do categories rank? | Horizontal bars | Exact labels and denominator |
| What is the fee/reward spread? | Box/dot plot | Raw observations and sample size |
| Is a tier worth it? | Break-even line or bullet chart | Assumption table |
| What provider creates concentration? | Ranked bars / small network diagram | Relationship table |
| Compare 2–3 programs across dimensions | Grouped bars; radar optional | Radar never sole representation |

All charts need visible labels, keyboard access to values, screen-reader summary, raw table, high-contrast palette, pattern/label differences beyond color, responsive reflow, and `prefers-reduced-motion`. Do not animate cumulative numbers for decoration.

## Metric definitions

Every market metric record should include name, plain-language definition, numerator, denominator, dimensions, source set, period, observation cutoff, calculation version, coverage, limitations, revision policy, and owner.

Examples:

- **Supported country:** at least one published live offering has a verified residency-eligible rule on the cutoff date. Waitlists do not count.
- **Maximum reward:** highest stated rate under any documented plan/condition; never used alone to rank.
- **Attainable reward:** model output for a declared scenario after caps/exclusions and optional token haircut.
- **Program availability:** lifecycle of a scoped offering, not presence of a marketing page.
- **Popularity:** prohibited unless a precise proxy is named, such as verified outbound interest, onchain addresses, or survey share.

## Product analytics

### Event taxonomy

- `country_selected` with explicit/derived choice source, never precise location.
- `filter_applied` and `no_result_seen`.
- `finder_started`, step completed, abandoned, and result viewed.
- `comparison_added`, differences toggled, attribute expanded.
- `evidence_opened`, source confirmed, limitation opened.
- `scenario_changed` by input category, not sensitive raw amount unless consented/rounded.
- `card_saved`, `alert_created`, `correction_started/submitted`.
- `official_link_clicked` and `affiliate_link_clicked` separately.
- `all_options_rejected` as a valid decision outcome.

Events include product/data revision, experiment, viewport band, and anonymous session ID. They exclude wallet addresses, identity documents, exact balances, free-text corrections, and issuer application data.

### Funnel

Landing/discovery → eligible shortlist → comparison/finder completion → evidence interaction → qualified decision → issuer confirmation/save/reject. Segment by persona intent, country, acquisition, and data-confidence band.

### Experiments and guardrails

Optimize QDC, comprehension, return rate, and correction quality—not outbound clicks alone. Guard against lower evidence engagement, ineligible clicks, partner-rank bias, increased false confidence, and slower performance.

## Internal operations dashboard

Show freshness debt, critical conflicts, queue age, source failures, parser acceptance rate, review throughput, correction SLA, entity duplicates, publication latency, and partner/nonpartner parity. Each chart links to actionable records.

## Storage strategy

PostgreSQL materialized aggregates are sufficient for catalog and quality analytics. PostHog owns product behavior. Add ClickHouse only after analytical volume or query isolation crosses documented thresholds in [tech-stack.md](tech-stack.md). Do not build a warehouse before the team has stable metric definitions.
