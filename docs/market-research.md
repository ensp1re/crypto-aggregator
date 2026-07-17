# Market research

Research date: 17 July 2026.

## Executive conclusion

The opportunity is not an empty directory market. Several sites already claim dozens or hundreds of cards. The opportunity is a **trust and normalization market**: competitors disagree about what counts as a card, flatten region-specific offerings into a single row, repeat marketing maximums, and rarely show field-level evidence.

The hardest part of this company will be continuous research operations. A scraper can discover changes; it cannot decide whether a marketing page, fee schedule, cardholder agreement, program manager, and regional help article describe the same legal offering. “Aggregate all cards” should therefore be a long-term coverage ambition, not the MVP promise.

## Category definition

A crypto card is a consumer or business payment credential that lets a user spend against cryptocurrency, stablecoins, a crypto-backed credit line, or a balance funded from digital assets. The database must distinguish:

- prepaid/debit cards that liquidate assets at purchase or top-up;
- stablecoin-account cards with fiat settlement behind the scenes;
- crypto-backed credit products where collateral is not sold at purchase;
- self-custodial or smart-contract-funded cards;
- conventional cards that merely pay rewards in a token;
- virtual, physical, and wallet-only credentials;
- announced, waitlisted, live, paused, closed-to-new-users, and discontinued programs.

These are not interchangeable. A rewards credit card is not evidence that a user can spend their crypto; a waitlist is not an available card; “self-custody” can still involve delegated permissions, smart-contract risk, or a custodial settlement step.

## Market structure

The value chain has more actors than the consumer-facing brand:

1. The card brand owns distribution and the user relationship.
2. A licensed bank or e-money institution may issue the credential.
3. A program manager and processor connect ledger, compliance, and network rails.
4. Visa or Mastercard provides acceptance and network rules.
5. A custody, wallet, exchange, stablecoin, or lending layer funds the transaction.
6. Local entities determine eligibility, disclosures, and complaints handling.

Infrastructure providers are expanding the supply side. [Visa and Bridge describe stablecoin-linked cards live in 18 countries with expansion planned to more than 100](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-bridge-stablecoin-linked-card-expansion.html). [Mastercard describes crypto-funded and crypto-backed credit configurations](https://www.mastercard.com/us/en/business/payments/consumer-payments/next-gen-payments/digital-asset-solutions/crypto-card-program.html), while platforms such as [Rain](https://www.rain.xyz/) and [Bridge](https://www.bridge.xyz/product/cards) market global issuing infrastructure. These are vendor claims, not independent market totals, but they support a durable trend: launching a branded card is becoming easier, which increases both catalog growth and program churn.

## Issuer and program landscape

“Issuer” must be used carefully. The brand on the card may not be the regulated legal issuer. The initial census should cover several operating archetypes rather than simply the most famous logos:

| Archetype | Current examples for research | Data complexity exposed |
|---|---|---|
| Exchange-funded debit/prepaid | [Bybit](https://www.bybit.com/en/help-center/article/Fees-and-Spending-Limits-Bybit-Card/), [Crypto.com](https://help.crypto.com/en/articles/2742447-crypto-com-prepaid-card-rewards-benefits) | Region, network, tier, conversion, caps, and MCC exclusions |
| Crypto-backed credit/dual mode | [Nexo](https://nexo.com/eea/crypto-card) | Collateral, interest, repayment, debit/credit mode, liquidation |
| Wallet/onchain funded | [MetaMask](https://metamask.io/card), [Gnosis Pay](https://gnosispay.com/card) | Smart-contract permissions, chains/assets, provider stack, gas/settlement |
| Stablecoin-account card | Programs issued through providers such as [Rain](https://www.rain.xyz/) or [Bridge](https://www.bridge.xyz/product/cards) | Brand versus issuer/processor, country rollout, offchain settlement |
| Token-reward conventional card | Exchange/wallet-branded credit products | Reward asset is crypto, but funding may be conventional fiat credit |
| Business expense card | Stablecoin treasury and program-management offerings | Entity residency, beneficial owners, seat controls, accounting, negotiated pricing |

These examples are not endorsements or a complete inventory. Official documentation demonstrates why one brand cannot safely become one row. [Bybit's general card FAQ](https://www.bybit.com/en/help-center/article/FAQ-Bybit-Card-General-Inquiries) varies regions, base currencies, type, and network; [MetaMask's FAQ](https://support.metamask.io/manage-crypto/metamask-card/card-faq/) distinguishes regional enrollment and card variants; [Gnosis Pay publishes country eligibility](https://help.gnosispay.com/hc/en-us/articles/39401751918612-Eligible-Countries-for-Gnosis-Pay) and time-bound reward terms. The census must record responsible legal entities and regional offerings, not describe every brand as the “issuer.”

Visa reported approximately $5.2 billion of stablecoin-linked card volume in 2025 and 319% year-over-year growth. This is a network-reported directional indicator, not a complete or independently audited category size. It should never be presented as total crypto-card spending without that caveat. See [Visa's stablecoin card discussion](https://www.visa.com/en-us/thought-leadership/innovation/stablecoin-linked-cards-monetize-money-movement).

## Existing product groups

### Crypto-card catalogs

[CryptoAgg](https://www.cryptoagg.io/), [CardPilled](https://cardpilled.com/), [Monevia](https://monevia.io/), [Crypto Card Compare](https://cryptocardcompare.io/), and [Curat](https://curat.money/compare-cards) provide discovery and comparison to varying degrees. Their visible catalog claims range from roughly 42 to more than 190. That spread is itself a market signal: inclusion rules, entity modeling, freshness, and deduplication are unresolved.

### Onchain market analytics

[Paymentscan](https://paymentscan.xyz/) tracks observable onchain activity associated with selected card programs and issuers. It creates a valuable market view but answers a different question from retail comparison: an onchain address is not necessarily a person, top-ups are not necessarily purchases, and programs with offchain funding are less observable.

### Mainstream comparison marketplaces

[NerdWallet](https://www.nerdwallet.com/), [Bankrate](https://www.bankrate.com/credit-cards/bankrate-score/), [Finder](https://www.finder.com.au/credit-cards), and [WalletHub](https://wallethub.com/edu/cc/credit-card-rating-system/125319/) demonstrate proven patterns: structured filters, disclosed methodology, scenario-based value, editorial pages, partner marketplaces, and high-intent SEO. Their weakness for this category is jurisdictional and product mismatch; crypto cards change faster and have custody, token, chain, and conversion risks absent from ordinary card tables.

### Travel-money research

[MoneySavingExpert's travel card guide](https://www.moneysavingexpert.com/credit-cards/travel-credit-cards/) is a better product lesson than many crypto directories. It explains dynamic currency conversion, local-currency payment, ATM economics, and why the first-ranked offer is not universally best. [Wise's fee presentation](https://wise.com/in/pricing/card-fees) sets a benchmark for showing the amount and path of a conversion, although Wise is a provider rather than a comparison marketplace.

## Demand and user problems

The decision is high-friction because users must reconcile documents across several domains. The recurring problems are:

- **Eligibility ambiguity:** “available in Europe” may mean EEA residents, selected citizenship, an entity-specific waitlist, or only an existing-account cohort.
- **Headline reward distortion:** maximum rates depend on tiers, locked tokens, monthly caps, eligible merchant categories, subscription status, and reward-token value.
- **Hidden effective cost:** issuance, monthly, top-up, crypto liquidation, exchange spread, FX, ATM, inactivity, replacement, and staking opportunity cost sit on separate pages.
- **Custody confusion:** “non-custodial,” “self-custody,” “spend from wallet,” and “no top-up” are marketing labels, not a consistent risk taxonomy.
- **Program fragility:** issuers, networks, processors, availability, terms, and wallet support can change quickly.
- **Evidence burden:** users must trust an aggregator screenshot or repeat the research themselves.
- **Recourse uncertainty:** chargebacks, refunds, frozen funds, support channels, and responsible legal entities are poorly compared.
- **Tax and regulatory context:** spending can trigger disposal or reporting consequences depending on jurisdiction; the product must flag the issue without pretending to give individualized advice.

Public forum discussions support these as research hypotheses—not representative evidence. Users describe uncertainty about conversion spread, custody claims, freezes, regional acceptance, and taxes. These themes must be validated through interviews and usability studies before changing priorities.

## Market gaps worth owning

| Gap | Why it persists | Product response |
|---|---|---|
| Region-specific truth | Sites model a brand as one row | Model program → legal/regional offering → tier → time-bound term |
| Field-level provenance | Sources are stored as page-level footnotes | Link every material claim to source, locator, observation, and reviewer |
| Effective value | Marketing percentages are easy to copy | Let users set spend, FX, ATM, token haircut, caps, and capital assumptions |
| Change history | Most directories overwrite records | Maintain valid-time and observed-time history with a public change ledger |
| Operational status | “Available” is treated as binary | Track announced, waitlist, live, paused, closed, and sunset per region |
| Confidence | “Verified” badges hide uncertainty | Show source authority, freshness, coverage, and conflict separately |
| Responsible entities | Brand, issuer, processor, and network are conflated | Publish an explicit relationship graph and complaint path where verified |
| Neutrality | Affiliate economics can shape rankings | Separate commercial metadata and audit ranking parity |

## Market entry recommendation

Start narrow and credible:

- 40–60 cards that cover the majority of observed consumer interest;
- 15–20 countries selected by program density, search demand, regulatory clarity, language capacity, and affiliate independence;
- consumer cards first, with business cards labeled but deferred;
- live products and clearly documented waitlists only;
- English first, while storing localized source text and jurisdiction metadata;
- eligibility, total cost, funding model, and evidence before popularity analytics.

The initial acquisition wedge is **country-aware verification**, not “all cards.” A user should reach a defensible shortlist in under three minutes and understand why every alternative was included or excluded.

## Research program before build

1. Conduct 18–24 interviews: at least three each with beginners, travelers/nomads, high spenders, DeFi users, and people who experienced a card failure or closure; add business users as a separate discovery track.
2. Ask participants to compare two real offerings using current issuer documents. Observe vocabulary and failure points rather than asking for desired features.
3. Prototype country-first and browse-first journeys; test whether users understand custody, effective value, confidence, and lifecycle labels.
4. Recruit five issuer or program-management experts to review the data model and source hierarchy.
5. Establish a quarterly market census with a published inclusion policy and reconciliation log.

## Strategic conclusions

- Supply growth helps acquisition but makes maintenance more expensive.
- Catalog count is a vanity metric unless denominator, inclusion policy, and freshness are public.
- The best near-term moat is a high-quality temporal evidence graph plus the operating process behind it.
- Onchain activity is useful context, not a proxy for product quality, user count, or retail spending.
- SEO can distribute the product, but direct alerts, newsletters, community corrections, and API customers must reduce search dependence.
- Trust can be lost faster through one undisclosed affiliate bias or stale high-risk claim than it can be gained through hundreds of listings.

## Key sources and limitations

Primary market signals include [Visa](https://corporate.visa.com/en/solutions/crypto/stablecoins/stablecoins-and-the-future-of-onchain-finance.html), [Mastercard](https://www.mastercard.com/global/en/news-and-trends/stories/2026/mastercard-crypto-partner-program.html), official issuer documents, competitor product pages, and public filings. Vendor market figures are directional. Competitor counts are homepage claims observed during research and may change. Forum themes are qualitative prompts, not population estimates. No purchased market report or proprietary traffic dataset was used.
