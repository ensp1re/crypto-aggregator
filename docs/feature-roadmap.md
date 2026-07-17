# CardStats feature roadmap

## Prioritization doctrine

Features are ranked against four questions:

1. Does this reduce a costly decision error?
2. Does it improve or compound proprietary data quality?
3. Does it create acquisition, retention, or revenue without compromising neutrality?
4. Can the team operate it reliably—not merely ship it?

Impact and business value use High/Medium/Low; complexity uses S/M/L/XL. A feature with high user appeal but no credible maintenance process is not MVP-ready.

## MVP: prove trusted decisions

Target: 40–60 verified consumer programs, 15–20 priority countries, English, responsive web. A program is publishable only after its critical fields meet the evidence and freshness gate.

| Capability | Impact | Complexity | Business value | Decision |
|---|---|---:|---|---|
| Program, regional offering, and tier catalog | High | L | High | Build first; foundation for everything |
| Country/residency eligibility | High | L | High | Primary acquisition wedge |
| Lifecycle status: announced/waitlist/live/paused/sunset | High | M | High | Prevents false availability |
| Browse, search, structured filters, URL state | High | M | High | Core discovery and SEO |
| Compare up to 4 desktop / 3 mobile | High | M | High | Core decision flow |
| Fees, rewards, caps, limits, benefits, funding/custody | High | L | High | Show conditions, not just rates |
| Program and issuer detail pages | High | M | High | Trust, search, and conversion surfaces |
| Field-level evidence and verification dates | High | L | High | Principal differentiation |
| Known/unknown/conflicting/stale value states | High | M | High | Stops misleading defaults |
| Basic guided finder | High | M | High | Country → funding → spend/use case |
| Official-site confirmation link | High | S | Medium | Always available before affiliate CTA |
| Public methodology, coverage, and corrections pages | High | M | High | Trust infrastructure |
| Internal source registry and review console | High | L | High | Operational prerequisite |
| Scheduled fetch, diff, validation, and review queue | High | L | High | Makes freshness sustainable |
| Basic market analytics | Medium | M | Medium | Counts/distributions with coverage caveats |
| Anonymous correction submissions | Medium | M | High | Quality feedback loop; moderated |
| SEO technical foundation | High | M | High | Server rendering, schema, canonical policy |
| Explicit product events and quality metrics | Medium | S | High | Validates the thesis |

### MVP definition of done

- No listed live offering lacks verified country scope, funding model, card type, lifecycle, core fees, core rewards, and responsible issuer relationship—or an explicit disclosed unknown.
- At least 90% of critical claims have Tier A/B official evidence.
- Top 20 programs were reviewed within seven days; the remaining launch set within fourteen days.
- A user can determine eligibility and compare three offerings on a 375px viewport without a horizontally compressed data table.
- Every recommendation explains inputs and exclusions.
- Partner status cannot alter results ordering.
- Change jobs are replayable, reviewable, and observable before launch.

## V1: prove retention and breadth

Target: 100+ programs, deeper country coverage, returning-user value.

| Capability | Impact | Complexity | Business value | Notes |
|---|---|---:|---|---|
| Effective annual value calculator | High | L | High | Spend buckets, caps, fees, token haircut, stake cost |
| Public change history and watch alerts | High | L | High | Email/web alerts; strongest retention loop |
| Accounts, saved scenarios, and shortlists | Medium | M | Medium | Anonymous use remains first-class |
| Country and use-case research pages | High | L | High | Only where unique verified data exists |
| Tier break-even and marginal reward charts | High | M | Medium | Especially useful for high spenders |
| Expanded provider/legal entity graph | High | M | High | Issuer, manager, processor, network, recourse |
| Incident and availability timeline | High | L | High | Fact-based; no unsupported “safe” verdict |
| Verified user-review pilot | Medium | XL | Medium | Limited markets; proof and moderation required |
| Issuer correction portal | Medium | L | High | Submissions enter normal review; no direct publish |
| Business card discovery beta | Medium | L | Medium | Separate taxonomy and eligibility |
| Public read API beta | Medium | M | High | Versioned, rate-limited, provenance included |
| Multilingual pilot | Medium | L | Medium | One market with human review; no machine-only index pages |

## V2: prove the data business

| Capability | Impact | Complexity | Business value | Notes |
|---|---|---:|---|---|
| B2B API and change feeds | High | L | High | Versioned contracts, SLAs, rights controls |
| Issuer submission workspace | High | L | High | Signed attestations and audit history |
| Licensed/independent adoption analytics | Medium | XL | High | Method-specific coverage and uncertainty |
| Historical fee/reward/availability indices | High | L | High | Compounds temporal moat |
| Review system expansion | Medium | XL | Medium | Only after fraud/moderation performance is proven |
| Advanced regional and cohort analytics | Medium | L | High | Exact denominator and source methodology |
| Embeddable comparison widgets | Medium | M | High | Distribution channel; neutral output |
| Team/business procurement reports | Medium | L | High | Exportable evidence and requirements |
| Multiple human-reviewed languages | High | XL | High | Prioritized by demand and research capacity |

## Future vision

- Versioned open schema for card programs, offerings, claims, and evidence.
- Industry change protocol and verified issuer attestations.
- Program resilience benchmarks based on transparent historical facts.
- Privacy-preserving transaction import for personal realized-cost analysis, only with explicit consent and strong local processing.
- Wallet and travel-platform decision APIs.
- Regulatory and issuer intelligence feeds for professional users.
- Independent annual “state of crypto cards” report with reproducible coverage.

## Explicit non-goals through V1

- Native mobile applications.
- Issuing, custody, application brokering, or fund movement.
- One universal card score or “safest card” label.
- Open, anonymous star reviews.
- Automatic publication of machine-extracted critical terms.
- A social feed, token-price terminal, portfolio tracker, or wallet connection.
- ClickHouse, Elasticsearch, Redis, GraphQL, Go microservices, or Kubernetes without measured need.
- Hundreds of thin country/pair pages for programmatic SEO.
- Paid verification badges or sponsored rank positions.

## Ranking model

There is no global default “best.” The finder produces a shortlist in this sequence:

1. Exclude ineligible, unavailable, stale-critical, or incompatible funding products.
2. Calculate scenario economics from user inputs and ranges.
3. Show decision dimensions separately: cost/value, usability, custody/funding fit, evidence confidence, and operational history.
4. Let the user choose weights or a declared use-case preset.
5. Explain every inclusion, exclusion, and rank change.

Editorial “best for” pages require a dated methodology, named reviewer, complete candidate set, nonpartner inclusion, scenario, and alternative. Commercial status is not an input.

## Effective-value model

The calculator should present a range, not a magically precise number:

**Net annual value = attainable rewards + user-valued benefits − program fees − conversion/FX/ATM costs − capital/opportunity cost − selected risk haircut.**

Inputs include eligible spend by category, monthly caps, reward asset haircut, subscription/tier, issuance and recurring fees, crypto conversion fee/spread, foreign spend, ATM behavior, stake/collateral amount, and a user-selected capital cost. Optional benefits default to zero until the user values them.

The model must expose unsupported assumptions and never treat a volatile token's spot value as guaranteed.

## Prioritization review cadence

Review quarterly using product evidence, not stakeholder volume. Each candidate should state user segment, decision error addressed, data dependency, ongoing operations cost, expected QDC effect, business effect, failure mode, and kill criterion. Roadmap items can move later when data quality or legal readiness is insufficient.
