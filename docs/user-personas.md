# CardStats user personas and research plan

## How to use these personas

These are decision archetypes, not demographic stereotypes. A single person can move between them. They are hypotheses derived from product research and must be validated through interviews, observed comparison tasks, support logs, and behavioral data.

Every persona shares three needs: exact eligibility, understandable money movement, and evidence that terms are current.

## 1. Casual crypto user

**Context:** Holds a modest balance on a major exchange or wallet and wants to spend it occasionally without learning card infrastructure.

**Goals**

- Use crypto for ordinary purchases.
- Avoid surprise fees or complicated top-ups.
- Choose a recognizable, supported provider.
- Understand whether spending triggers asset conversion.

**Frustrations**

- Terminology such as settlement, collateral, spread, and MCC exclusion.
- Reward maximums that require a large token stake.
- Unclear distinction between debit, prepaid, and credit.
- Fear of sending funds to the wrong balance or network.

**Desired features**

- Country-first guided finder with plain-language explanations.
- “How money moves” diagram for each offering.
- Starter scenario with monthly spend and simple total cost.
- Clear support, refund, and account-risk information.
- Shortlist of eligible options, not a hundred-card table.

**Success moment:** “I understand the tradeoff and can confirm it on the issuer site.”

## 2. Digital nomad

**Context:** Resides, banks, earns, and travels across different countries. Residency documents and card delivery may not match current location.

**Goals**

- Obtain and retain a card despite mobility.
- Spend in multiple currencies with predictable conversion.
- Use Apple Pay or Google Pay before physical delivery.
- Access cash and replace a card abroad.

**Frustrations**

- “Available in Europe” without a residency definition.
- Delivery-country restrictions and proof-of-address rules.
- FX spread hidden behind “zero FX fee.”
- ATM caps, weekend rates, and replacement limitations.
- Program shutdowns after moving funds.

**Desired features**

- Residency, citizenship, delivery, and travel-use eligibility as separate facts.
- Multi-currency scenario with FX and ATM usage.
- Wallet support, virtual-card timing, and delivery estimates.
- Operational status and change alerts.
- Alternatives for the same residency, not geolocation-based personalization.

**Success moment:** “This card is available to a resident of X and economical for spending in Y and Z.”

## 3. Frequent traveler

**Context:** Maintains a stable home country but spends materially abroad and values reliability, travel benefits, and recourse.

**Goals**

- Minimize total foreign-spend and ATM cost.
- Avoid dynamic currency conversion and weak exchange rates.
- Gain lounge, insurance, concierge, or travel rewards where genuinely valuable.
- Keep a reliable backup card.

**Frustrations**

- Benefits listed without conditions, caps, guests, or enrollment.
- “No FX fee” that excludes crypto conversion spread.
- Poor card acceptance, offline terminal, deposit, or rental behavior.
- Weak dispute and emergency-replacement information.

**Desired features**

- Travel scenario calculator and effective exchange path.
- Benefit valuation toggles—never assume a lounge visit is worth full retail price.
- Network, physical/virtual status, wallet support, and acceptance caveats.
- User evidence about travel use, carefully moderated and dated.
- Two-card portfolio comparison for primary and backup.

**Success moment:** “I know the expected cost of a €1,000 foreign trip and the operational caveats.”

## 4. High spender

**Context:** Spends enough that caps, reward tiers, liquidity, conversion execution, and support quality materially change annual value.

**Goals**

- Maximize risk-adjusted net annual value.
- Understand caps, marginal reward rates, and qualifying capital.
- Obtain high limits and reliable support.
- Evaluate opportunity cost of staking, subscriptions, or collateral.

**Frustrations**

- Marketing rates presented without monthly caps.
- Reward tokens valued at spot with no volatility or liquidity haircut.
- Staked capital treated as free.
- Limits shown without period, verification tier, or region.
- No evidence of program durability.

**Desired features**

- Editable spend distribution and diminishing-return chart.
- Token haircut, stake opportunity cost, and collateral risk assumptions.
- Tier break-even analysis and cap calendar.
- Limits, source hierarchy, incident history, and legal entity details.
- Exportable assumptions and change alerts.

**Success moment:** “The higher advertised rate loses after the cap and capital cost; I can defend the alternative.”

## 5. DeFi user

**Context:** Holds assets onchain, values self-custody, and evaluates smart-contract, approval, bridge, and chain risk.

**Goals**

- Spend without pre-funding a centralized exchange where possible.
- Control which assets and chains fund transactions.
- Understand approvals, settlement, liquidation, and fallback behavior.
- Preserve privacy consistent with legal requirements.

**Frustrations**

- “Non-custodial” used without a technical definition.
- Identity verification conflated with custody.
- Missing contract audits, permissions, supported chains, or oracle behavior.
- Gas, bridge, slippage, and failed-transaction costs omitted.
- No separation between smart-contract balance and issuer settlement risk.

**Desired features**

- Structured custody/funding taxonomy and transaction-flow diagram.
- Chain, asset, contract, approval, and liquidation details with sources.
- Smart-contract audit and upgradeability facts—not an aggregator safety verdict.
- Gas/bridge/conversion assumptions in effective cost.
- Alerts for contract, issuer, and supported-asset changes.

**Success moment:** “I know exactly which party or contract controls value at each step.”

## 6. Business user

**Context:** Founder, finance lead, or distributed-team operator considering cards for treasury spend, employee expenses, or stablecoin operations.

**Goals**

- Issue cards to employees with controls and accounting exports.
- Understand entity-country eligibility and beneficial-owner checks.
- Reconcile stablecoin funding with fiat expenses.
- Obtain predictable limits, support, and audit trails.

**Frustrations**

- Consumer and business programs mixed in the same catalog.
- Missing seat fees, program minimums, card controls, accounting integrations, and settlement detail.
- Sales-led pricing and unsupported country/entity combinations.
- Regulatory, tax, and treasury-policy uncertainty.

**Desired features**

- Dedicated business taxonomy and entity-residency eligibility.
- Seat, platform, FX, funding, issuance, and interchange economics.
- Spend controls, roles, exports, API, and integration comparison.
- Procurement-ready evidence package and provider contact.

**Success moment:** “I have a compliant shortlist and requirements document for procurement.”

**Product decision:** Business cards are a V1/V2 research track, not an MVP filter bolted onto consumer records.

## 7. Crypto beginner

**Context:** Interested in rewards or stablecoin spending but may not understand wallets, volatility, taxable disposal, or provider risk.

**Goals**

- Learn whether a crypto card is appropriate at all.
- Avoid scams, leverage, volatile reward assumptions, and irreversible mistakes.
- Compare with a conventional travel or cashback card.

**Frustrations**

- Interfaces that assume crypto knowledge.
- Token logos and percentages without fiat examples.
- False confidence from “verified” or “best” labels.
- Missing explanation of taxes, custody, deposits, and conversion.

**Desired features**

- “Should I use a crypto card?” decision path, including “probably not.”
- Glossary in context and fiat-denominated examples.
- Risk and tax prompts linked to official local resources.
- Conventional-card benchmark and no-card alternative.
- No account required for basic research.

**Success moment:** “I can decide not to apply, and I understand why.”

## Cross-persona jobs and priority

| Job | Casual | Nomad | Traveler | High spender | DeFi | Business | Beginner |
|---|---:|---:|---:|---:|---:|---:|---:|
| Confirm eligibility | High | Critical | High | High | High | Critical | High |
| Understand funding/custody | High | Medium | Medium | High | Critical | High | Critical |
| Model effective cost | High | Critical | Critical | Critical | High | Critical | High |
| Inspect evidence/freshness | High | High | High | Critical | Critical | Critical | High |
| Compare rewards | Medium | Medium | High | Critical | Medium | Medium | Medium |
| Track changes | Low | Critical | High | Critical | Critical | High | Low |
| Reviews/operational signal | Medium | High | Critical | High | High | High | Medium |

Eligibility, evidence, and cost are the MVP common denominator. Community ranking is not.

## Research plan

### Discovery interviews

Recruit 18–24 participants across the archetypes, including at least five people who experienced a declined application, freeze, material term change, or closure. Avoid recruiting solely from one card community. Compensate participants without conditioning payment on positive views.

Ask participants to share their last real decision, reconstruct the sources they used, and compare two current cards. Capture terminology, uncertainty, abandonment points, and what evidence changed their mind.

### Prototype studies

Run three rounds of five participants:

1. Test country-first discovery versus unrestricted browse.
2. Test mobile comparison, unknown/conflicting states, and source inspection.
3. Test the effective-value model and whether ranges reduce or increase comprehension.

Primary measures: task completion, incorrect eligibility selection, comprehension of funding/custody, ability to identify the cheaper scenario, evidence engagement, and calibrated confidence.

### Continuous research

- Add an optional one-question exit survey: “What information was missing?”
- Tag correction submissions by field and root cause.
- Conduct quarterly interviews with users who chose “none.”
- Review search queries with no results and comparison attributes repeatedly opened.
- Maintain an issuer/research-advisor panel without granting editorial control.

## Anti-personas and safety boundaries

The MVP is not optimized for people seeking anonymous evasion of KYC, guaranteed returns, jurisdiction bypass, sanctions evasion, or leverage recommendations. It can explain privacy and custody accurately, but it must not help users defeat eligibility or compliance controls.

The product also should not imply that a card is appropriate merely because it is eligible. Beginners need a clear conventional-card and “do nothing” comparison.
