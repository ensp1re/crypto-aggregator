# Card benefits, plans, and tier source audit

Status: **research baseline — not a publication approval**  
Observed: **18 July 2026**  
Coverage: **all 42 programs in `discovery-snapshot.json`**

This audit separates a card program from its regional/legal offerings, paid plans, loyalty tiers,
verification levels, and time-limited promotions. A marketing maximum is not treated as a normal
reward rate. Claims that are only visible in an app or image, conflict across official pages, or have
passed their stated launch date remain unresolved.

## Publication rules derived from the audit

1. Compare a regional offering, not a brand-level card row. Coinbase, Crypto.com, Bybit, Wayex,
   imToken, and Bitget Wallet each contain materially different products or issuers.
2. Keep plan and loyalty tier as separate selectors. Plutus combines a paid plan with a PLU reward
   level; ether.fi combines a membership level with card economics; SafePal uses account points.
3. Store promotions separately with start and end dates. Gnosis cashback, KAST seasons, temporary
   staking discounts, and boosted category campaigns must never overwrite durable terms.
4. A partner wrapper is not a new underlying card. SafePal, SavePay, TokenPocket, and some Bitget
   Wallet offerings use Fiat24 infrastructure but can still have different access, branding, or
   top-up terms.
5. Lifecycle is a first-class fact. `live`, `paused_for_new_signups`, `waitlist`, `winding_down`,
   `announced`, and `unresolved` must be visible before benefits.
6. `not disclosed`, `not offered`, `conflicting`, and `stale` are distinct from zero.

## Program-by-program findings

### 1. Nexo Card

- Offering: EEA/UK Mastercard with Credit and Debit modes.
- Tier model: Base, Silver, Gold, and Platinum loyalty tiers based on the NEXO share of a portfolio;
  this is not four separate cards.
- Benefits: credit-mode rewards rise from 0.5% to 2% in NEXO, or 0.1% to 0.5% in BTC; tiered
  fee-free ATM allowances; Apple Pay and Google Pay; no monthly, annual, or inactivity fee.
- Conditions: physical-card access requires both a portfolio threshold and Gold tier. FX terms vary
  by region, weekday/weekend, and tier, so a single global FX value is invalid.
- Sources: [card and loyalty table](https://nexo.com/eea/crypto-card).

### 2. Coinbase Card

- Program split required: Coinbase Card is a US Visa debit card; Coinbase One Card is a separate US
  American Express credit card. They must not share one comparison row.
- Debit benefits: optional, variable crypto rewards shown in-app; no Coinbase spending fee; ATM
  operator fees may apply. The debit reward rate cannot be hard-coded.
- Credit tiers: 2%, 2.5%, 3%, or 4% bitcoin back based on assets held at Coinbase. Rates above 2%
  apply to the first $10,000 of eligible monthly purchases, then fall to up to 2%.
- Credit benefits: 5% bitcoin back through Coinbase travel plus Amex retail, warranty, rental,
  trip, luggage, roadside, emergency, Offers, and Experiences benefits.
- Sources: [debit overview](https://help.coinbase.com/en/coinbase/trading-and-funding/coinbase-card/cb-card),
  [debit rewards](https://help.coinbase.com/en/coinbase/trading-and-funding/coinbase-card/cb-card-rewards),
  [credit overview](https://help.coinbase.com/en/creditcard/overview), and
  [credit benefits](https://help.coinbase.com/en/creditcard/benefits-features).

### 3. Binance Card

- Regional split required: the current official product evidence found is a Binance Mastercard
  issued in Brazil. The former EEA Visa program must not be represented as a current global card.
- Benefits and tiers: Binance educational content still describes BNB-balance cashback, but it does
  not safely establish the current Brazil reward table or terms.
- Publication state: keep fees, rewards, and benefit tiers `not_disclosed` until the current Brazil
  fee/reward terms are captured; do not reuse the old EEA BNB tier table.
- Sources: [current Binance Brazil product FAQ](https://www.binance.com/pt-BR) and
  [official educational overview](https://academy.binance.com/en/articles/what-are-crypto-cards-and-how-do-they-work).

### 4. Kripicard

- Naming correction: the program is Kripicard; “Premium” is the current virtual-card product, not
  the issuer name.
- Plan model: one current Premium virtual Visa/Mastercard product; no evidence of multiple live tiers.
- Economics: $5 issuance, 4% funding, $1 processing, zero monthly/authorization/FX fee, and a $10
  initial load minimum. Apple Pay, Google Pay, and Samsung Pay are supported.
- Benefits: cashback and reward features are on the Q4 2026 roadmap and are not current benefits.
- Sources: [fees](https://home.kripicard.com/fees) and [roadmap](https://home.kripicard.com/roadmap).

### 5. Crypto.com Card

- Regional split required: the prepaid card has different fee schedules and eligibility in Europe,
  UK, Canada, Latin America, and other regions. The US Visa Signature credit card is separate.
- Plan model: Basic, Plus, Pro, Private ($50k), and Private ($500k/Obsidian) under Level Up.
- Benefits: base card rewards range from none to 5%, with plan spend caps; selected Spotify,
  Netflix, and Truth+ rebates; lounge access; and plan-dependent Crypto.com Travel rewards.
- Conditions: first-year rates and eligibility depend on subscription, lockup, staking, and region.
- Sources: [Level Up benefits](https://help.crypto.com/en/articles/12017612-level-up-rewards-and-benefits),
  [prepaid-card benefits](https://help.crypto.com/en/articles/10068089-level-up-experience-rewards-benefits-crypto-com-card-rest-of-world),
  and [Crypto.com Travel](https://help.crypto.com/en/articles/14836843-crypto-com-travel).

### 6. Bybit Card

- Regional split required: card type, fees, limits, and availability vary by issuing region.
- Reward tier: Base, Beta, Alpha, Apex, Omega, and Infinite, driven by monthly spend or VIP mapping;
  advertised rates reach 10% with tier-specific cashback caps.
- Subscription benefit: selected services such as Netflix, Spotify, and ChatGPT can receive a 100%
  rebate at eligible tiers within the program cap. Campaign availability must be dated.
- Sources: [reward tiers](https://www.bybit.com/en/help-center/article/Introduction-to-Bybit-Card-Rewards),
  [subscription campaign](https://www.bybit.com/en/promo/campaign/100_percent_cashback_subscriptions),
  [card FAQ](https://www.bybit.com/en/help-center/article/FAQ-Bybit-Card-General-Inquiries), and
  [fees and limits](https://www.bybit.com/en/help-center/article/Fees-and-Spending-Limits-Bybit-Card).

### 7. KAST Card

- Plan model: Standard, Premium, Limited, and Luxe.
- Current marketing: Standard is free with 2% Season 5 rewards; Premium is $1,000/year with 5%;
  Limited is $5,000 one-time with 5% and concierge; Luxe starts at $10,000/year with 8% and concierge.
- Additional reward: the page also advertises 4% in MOVE on spend. This must be modeled separately
  from seasonal points and not summed without the applicable terms.
- Publication gap: capture Season 5 validity dates and reward terms before treating any rate as durable.
- Source: [official crypto cards page](https://www.kast.xyz/crypto-cards).

### 8. Gemini Credit Card

- Plan model: one US WebBank Mastercard credit card, not a tiered card family.
- Benefits: 4% on gas, EV charging, and transit on the first $300 monthly category spend, then 1%;
  3% dining, 2% groceries, 1% other qualifying purchases; rewards in bitcoin or 50+ cryptos.
- Other benefits: merchant-specific Vault offers can reach 10%; no annual fee; Mastercard benefits
  are separate from the base reward table.
- Sources: [current card page](https://www.gemini.com/credit-card) and
  [official product overview](https://support.gemini.com/hc/en-us/articles/4405148512923-Product-Overview).

### 9. MetaMask Card

- Plan model: free Virtual and $199/year Metal.
- Benefits: Virtual earns 1% mUSD; Metal earns 3% on the first $10,000 yearly then 1%. Entravel hotel
  checkout can total 5% for Virtual and 7% for Metal; Blackbird dining offers FLY benefits.
- Lifecycle: new US and UK signups are paused; Metal orders have been paused since 2 June 2026.
- Sources: [overview](https://support.metamask.io/trade/metamask-card/what-is-metamask-card/),
  [FAQ](https://support.metamask.io/trade/metamask-card/card-faq/),
  [Metal Card](https://support.metamask.io/trade/metamask-card/metal-card/), and
  [limits and fees](https://support.metamask.io/manage-crypto/metamask-card/limits-and-fees/).

### 10. ether.fi Cash

- Membership model: Core, Luxe, Pinnacle, and invite-only VIP. Levels are earned through monthly
  membership points or ETHFI holdings; they are not separate catalog cards.
- Card benefits: plastic/metal styles, increasing physical and virtual card counts, lower FX margins,
  higher daily spend limits, hotel discounts, concierge, lounge access, and personal-finance services.
- Important status detail: several Club benefits are explicitly marked coming soon; the comparison
  must not render those as live.
- Sources: [Club levels and benefits](https://help.ether.fi/en/articles/303625-how-do-membership-levels-work),
  [fees and limits](https://help.ether.fi/en/articles/303623-what-are-the-transaction-limits-and-fees-for-personal-cash-credit-cards),
  [physical cards](https://help.ether.fi/en/articles/376356-physical-cards-everything-you-need-to-know), and
  [cashback](https://help.ether.fi/en/articles/262374-how-does-cashback-work).

### 11. Wirex Card

- Current membership model: Wirex One Base, Premium, Elite, Private, and Bespoke, based on portfolio
  size and WPAY allocation. Older Standard/Premium/Elite help pages are a legacy model.
- Benefits: tiered 0.5% to 8% cashback, up to 50% refunds on eligible AI, mobility, fitness, news,
  and finance subscriptions, plus tier-specific travel and lifestyle benefits.
- Publication gap: retain the effective date and region of Wirex One; never combine its tiers with
  legacy Cryptoback plan tables.
- Sources: [Wirex One launch](https://www.wirexapp.com/post/discover-wirex-one-s-new-membership-model)
  and [current card page](https://www.wirexapp.com/en-sg/stablecoin-and-crypto-card).

### 12. BitPay Card

- Lifecycle: BitPay officially states that new card applications are temporarily paused while the
  program is improved. The old card page now redirects away from an active product page.
- Benefits: old cashback posts and cardholder agreements are historical evidence, not current terms.
- Publication state: `paused_for_new_signups`; current rewards and fees are `stale` until BitPay
  publishes the replacement program.
- Sources: [official application status](https://bitpay.com/wallet-verify/get-started) and
  [historical cardholder agreement](https://bitpay.com/assets/pdfs/mc-cardholder-agreement.pdf).

### 13. COCA Card

- Loyalty tiers: Starter, Standard, Standard+, Premium, Premium+, and Elite, unlocked by staking
  COCA. The exact tier table is supplied as an image and still needs structured capture/review.
- Verified Starter benefits: 1% card cashback and 6% APY on eligible card balance.
- Other benefits: higher tiers alter cashback allowance and subscription-category count; the program
  offers 50% on the first eligible subscription in a category each month, with a $70 charge cap, and
  hotel discounts up to 50%.
- Promotions: staking discounts have explicit eligibility dates and must remain a separate promotion.
- Source: [loyalty terms](https://help.coca.xyz/support/solutions/articles/205000042710-tier-system-terms-conditions).

### 14. Brighty Card

- Subscription plans: free Brighty One, Brighty Plus, and Brighty Pro. Current prices and exact plan
  feature values are disclosed in-app, not in the public subscription terms.
- Benefits: card cashback is merchant/category/country/plan dependent and shown in-app; eligible
  stablecoin card balances can earn daily rewards depending on plan.
- Publication state: plan names are known, but rates and plan prices remain `not_disclosed` for a
  public comparison until captured from authoritative current terms or reviewed app evidence.
- Sources: [subscription terms](https://brighty.app/en/subscription-terms-and-conditions),
  [cashback terms](https://brighty.app/en/cashback-terms), and
  [card terms](https://brighty.app/en/updated-earning-and-payment-card-terms-and-conditions).

### 15. Cypher Card

- Lifecycle: winding down. Cypher says services end on 6 September 2026 and Premium is no longer
  available for purchase.
- Legacy plan benefits for existing Premium users: metal card, zero USDC load fee, 2x rewards, fraud
  coverage, lower FX, higher limits, add-on cards, and priority service until shutdown.
- Publication state: show the wind-down before any benefit and do not present an apply CTA.
- Sources: [plans and wind-down notice](https://cypherhq.io/plans) and [help center](https://cypherhq.io/help).

### 16. Venmo Credit Card

- Plan model: one US Synchrony Visa credit card; it is not funded by crypto.
- Benefits: 3% on the top eligible spend category, 2% on the second, and 1% elsewhere and on eligible
  person-to-person transactions; no annual fee.
- Crypto relationship: Cash Back to Crypto can automatically use rewards to buy crypto. A spread can
  apply even when the standard purchase fee is waived.
- Sources: [credit-card FAQ](https://help.venmo.com/cs/articles/venmo-credit-card-faq-vhel312) and
  [reward and crypto terms](https://help.venmo.com/cs/articles/venmo-credit-card-rewards-program-terms-and-cash-back-to-crypto-terms-vhel127).

### 17. Bitrefill Card

- Verification levels: Starter and Plus change limits; they are KYC levels, not paid reward plans.
- Benefits: 1% on crypto deposits and 1% on eligible spend, redeemable as euro Bitrefill store credit;
  a free monthly 20GB eSIM after depositing more than €500.
- Economics: no issuance or monthly fee, 1.99% deposit fee plus variable conversion cost, 2.49% ATM,
  and €10/month inactivity after 12 inactive months.
- Sources: [card overview](https://www.bitrefill.com/card),
  [rewards](https://www.bitrefill.com/card/rewards),
  [pricing](https://www.bitrefill.com/card/pricing), and
  [cashback FAQ](https://help.bitrefill.com/hc/en-us/articles/31491398773010-How-do-I-earn-Bitrefill-Card-cashback).

### 18. WhiteBIT Nova

- Naming correction: the program is WhiteBIT Nova; there are no card tiers in current evidence.
- Benefits: users can select up to three categories daily. Official examples include 10% subscriptions,
  5% taxis, and 1% groceries/restaurants, with a €25 monthly maximum and BTC or WBT payout.
- Economics: zero opening, monthly, cancellation, and inactivity fees; €12 physical shipping;
  transaction and ATM fees can apply.
- Sources: [card page](https://whitebit.com/crypto-card) and
  [official help article](https://help.whitebit.com/hc/en-gb/articles/23273438576925-WhiteBIT-N%C3%B3va-debit-card).

### 19. Wayex Card

- Regional split required: the Australian crypto-to-AUD card and the global USD stablecoin card have
  different issuers, fee logic, and availability.
- Australia: free digital card, 1% crypto-to-AUD conversion on spend, no Wayex annual or FX fee.
- Global: virtual USD card through Lead Bank/Bridge, no USD transaction fee; country and exact fee
  terms differ. No durable card cashback program was found.
- Sources: [Australia FAQ](https://help.wayex.com/en/articles/9167149-frequently-asked-questions),
  [Australia fees](https://www.wayex.com/au/fees/), and [global FAQ](https://www.wayex.com/en/faq/).

### 20. Gnosis Pay

- Plan model: one self-custodial Visa debit program; GNO holdings create reward tiers, not card tiers.
- Current promotion: through 30 September 2026, holding 0.1/1/10/100 GNO gives 1/2/3/4% base
  cashback with $250/$375/$500/$1,250 weekly eligible spend caps. The OG NFT adds 1%.
- Other economics: no added Gnosis FX fee; tier-independent card and ATM limits from the fee guide.
- Source: [current cashback terms](https://help.gnosispay.com/hc/en-us/articles/40288567337876-Intermediary-Cashback-Programme)
  and [fees and limits](https://help.gnosispay.com/hc/en-us/articles/39533569163284-Understanding-Your-Card-s-Fees-and-Limits).

### 21. Fold Card

- Product split required: the established Fold debit card and limited-launch Fold credit card are
  separate offerings. The catalog entry should identify the debit card.
- Plan model: free Member and Fold+ at $10/month or $100/year.
- Debit benefits: Fold+ lists 1.5% dining/travel, 0.5% other eligible card spend, merchant boosts up
  to 15%, and eligible ACH bill-pay rewards. Free Member does not list the same base rates.
- Sources: [pricing](https://foldapp.com/pricing) and [rewards help](https://support.foldapp.com/hc/en-us/categories/360005013091-Rewards).

### 22. Bleap Card

- Plan model: no card tiers found.
- Durable rewards: 1% default, 3% on named mobility/delivery merchants, and 20% on selected streaming,
  AI, and gaming subscriptions, subject to merchant-specific fair-use caps.
- Promotions: the 2% restaurant/supermarket campaign ended 31 May 2026 and is not current.
- Sources: [card](https://www.bleap.finance/en-us/card),
  [cashback](https://www.bleap.finance/en-us/card/cashback), and
  [cashback terms](https://www.bleap.finance/legal-agreements/cashback-terms-and-conditions).

### 23. Bitpanda Card

- Plan model: one card; the former BEST VIP reward tiers ended in April 2025.
- Current benefit: flat 1% on eligible purchases funded with qualifying crypto. Stablecoins, metals,
  stocks, and fiat-funded transactions do not earn card cashback.
- Economics: first card free; 2% ATM fee with €2 minimum; regional wallet support must be checked.
- Sources: [card benefits](https://support.bitpanda.com/hc/en-us/articles/360018933120-What-is-the-Bitpanda-Card-and-what-are-its-benefits)
  and [cashback eligibility](https://support.bitpanda.com/hc/articles/4413398057490-Bitpanda-Card-cashback-applicability).

### 24. Zypto Card

- Product split required: Premium reloadable Visa and nonreloadable virtual cards are different.
- Premium Visa economics: no monthly fee; physical $50; virtual requires a $10 starting balance;
  $0.30 transaction, 1.75% FX, 3% crypto off-ramp, and 1% physical-card ATM fee.
- Benefits: Visa Signature lounge, hotel, concierge, travel, and purchase protections.
- Loyalty: Rewards Hub levels are ecosystem-wide and based on lifetime ZYPs plus ZYPTO holdings;
  the current card earn rate is variable/in-app and should not be presented as a fixed tier benefit.
- Sources: [card portfolio](https://zypto.com/personal/crypto-cards/) and
  [card types](https://help.zypto.com/en/articles/14665487-zypto-card-types-explained).

### 25. Ledger CL Card

- Plan model: one free virtual CL card; no card tiers.
- Benefits: current page lists 1% in BTC/USDC in the US or BTC/USDT in other supported markets,
  Apple Pay/Google Pay, and ATM access.
- Conflict handling: a legacy Ledger page mentions a 2% BXX option; use the current shop page and
  retain the legacy value as stale evidence.
- Regional split: provider and eligibility differ across UK/EEA, US, Canada, Switzerland, Colombia,
  Mexico, and Brazil.
- Sources: [current CL card page](https://shop.ledger.com/pages/cl-card-crypto-card) and
  [legacy product page](https://www.ledger.com/cl-card).

### 26. Tuyo Card

- Plan model: one virtual card; physical card and ATM support are coming soon.
- Economics: no issuance, monthly, or annual fee; zero fee for USD payments and approximately 1%
  for non-USD FX; $10,000 daily spend limit.
- Benefits: TUYOs points and the “Buy Now Pay Maybe” program exist, but current rates and mechanics
  are app/terms dependent. Do not convert them to guaranteed cashback.
- Sources: [card](https://tuyo.com/card) and [rewards](https://tuyo.com/rewards).

### 27. RedotPay Card

- Subscription split: Standard card plus optional Pro monthly and annual memberships.
- Standard economics: $10 virtual or $100 physical issuance; no monthly/annual management fee.
- Pro benefits: monthly $12.90 includes one virtual card and 3% Apple/Google Pay purchase cashback,
  capped at $18/month; annual $129 includes a physical card, the same cashback, ATM fee waiver up to
  $1,000/month, and a region-dependent Earn boost.
- Source: [RedotPay Pro guide](https://helpcenter.redotpay.com/en/articles/14686020-getting-started-with-redotpay-pro).

### 28. Tria Card

- Plan model: Virtual, Signature, and Premium.
- Rewards: 1.5%, 4.5%, and 6% respectively within plan spend caps, then lower fallback rates;
  staking badges can add 0.25% to 2%.
- Benefits: plan-dependent lounge/baggage travel features and card protections. The July Spend Fest
  is a dated promotion and cannot replace base caps.
- Sources: [cashback guide](https://help.tria.so/en/articles/13696877-cashback-general-information),
  [cashback terms](https://docs.tria.so/card-cashback-terms), and
  [benefit overview](https://www.tria.so/en/blogs/your-tria-card-does-more-than-you-think).

### 29. Avici Card

- Product model: self-custodial USDC-secured Visa credit card; the docs describe operational card
  funding, use, physical cards, fees, and limits.
- Lifecycle conflict: the homepage still labels the crypto-backed Visa credit line “coming soon,”
  while recently updated docs tell users to create and use cards.
- Benefits: marketing mentions airline, hotel, dining, rental, concierge, and Visa protections, but
  exact eligibility and tiering are not disclosed in the docs reviewed.
- Publication state: lifecycle `conflicting`; do not show an apply state or benefit entitlement until
  the official pages are reconciled.
- Sources: [homepage](https://avici.money/) and
  [secured-card docs](https://docs.avici.money/getting-started/secured-credit-cards).

### 30. Oobit Card

- Plan model: no paid card tiers found; rewards depend on the asset used.
- Rewards: current 5X terms give 10% on eligible OOB-funded transactions up to $10,000 monthly.
  Other supported-token cashback applies only to a much smaller monthly spend allowance and the
  rate can depend on the asset or promotion.
- Benefits: rewards convert to USDC/USDT but are restricted to in-app Tap to Pay use; they are not
  freely withdrawable cash.
- Sources: [card](https://www.oobit.com/crypto-card),
  [cashback](https://www.oobit.com/cashback), and
  [5X reward terms](https://www.oobit.com/legal/5x-reward-terms).

### 31. Plutus Card

- Two-dimensional model: Starter/Everyday/Premium paid plans plus separate PLU Reward Levels from
  Noob through Honey Badger. A user can have both a plan and a reward level.
- Advertised plan base: 3% with £/€250, £/€500, or £/€1,000 plan spend caps and one, two, or three
  monthly perks; reward levels can raise headline rates to 9% and alter caps/perks.
- Lifecycle: official migration material says cards will relaunch in Q2 2026, but that date has passed
  and the current campaign still says “cards return Q2.” Mark card availability `stale/unresolved`.
- Sources: [plans](https://www.plutus.it/plans),
  [migration FAQ](https://www.plutus.it/blog/plutus-q1-migration-faq), and
  [current campaign](https://join.plutus.it/).

### 32. Deblock Card

- Plan model: Standard (free), Premium (€14.99/month or €120/year), and Native (free after holding a
  Deblock NFT for at least 30 days).
- Benefits: Premium/Native provide up to 1% card cashback, more physical/virtual/single-use cards,
  NFT card customization, larger ATM/FX allowances, and lower crypto trading fees.
- Source priority: use the fee PDF effective 5 July 2026 rather than older pricing documents.
- Source: [current English fee schedule](https://cdn1.deblock.com/terms/fee_info/Fees_Pages_Deblock_EN_v6.3.pdf).

### 33. Ready Card

- Naming and plan model: one Ready Card program with Lite and Metal plans; do not list “Ready Lite”
  and “Ready Metal” as separate programs.
- Lite: free plastic card, $6.99 shipping, 1% FX, 2% ATM, and app-disclosed Ready Points rate.
- Metal: 120 USDC first year, 0% FX, $800/month fee-free ATM allowance, and up to 3% in Ready Points.
- Benefits: Ready Travel and plan-specific partner offers. Claude/Netflix/Spotify redemption boost is
  explicitly coming soon and must be labeled as such.
- Sources: [card](https://www.ready.co/card) and [FAQ](https://www.ready.co/blog/card-faqs).

### 34. TapX Card

- Source-identity issue: the catalog points to `tapxcard.com`, which did not resolve. Search results
  surface `tapxcard.io` with MasterCard Pro, Visa E-commerce, Visa Premium, and Mastercard Infinity,
  but continuity of ownership has not been established.
- Candidate economics on the `.io` site: $25-$65 issuance, 2.5%-3.5% top-up, plan-specific limits,
  and mobile-wallet support; it does not match the catalog's current generic claims.
- Publication state: `unresolved_source_identity`; exclude fixed benefits and tiers until the issuer,
  legal terms, and domain relationship are verified.
- Candidate sources: [cards](https://tapxcard.io/cards) and [FAQ](https://tapxcard.io/faqs).

### 35. Fiat24 Card

- Plan model: Standard, Premium, and Ultimate, determined by the account NFT digit/tier.
- Benefits/economics: account and card limits scale by tier; crypto top-up fees are 1%, 0.5%, and
  0.25%; virtual Mastercard supports Apple Pay, Google Pay, and Samsung Pay.
- No verified card cashback program was found; do not infer one from partner wrappers.
- Sources: [individual pricing](https://docs.fiat24.com/products/pricing-for-individuals) and
  [Mastercard debit guide](https://docs.fiat24.com/user/payments/mastercard-debit).

### 36. THORWallet Card

- Product conflict: the current homepage describes Basic (free) and Premium ($75/year) while older
  official docs describe Standard/Gold/Platinum cards with one-time ETH fees.
- Current candidate benefits: Basic has no cashback and 1.5% FX; Premium advertises up to 2%, 0.5%
  FX, a physical card, and TITN-based boosts/caps.
- Publication state: plan lifecycle and availability are `conflicting`; TITN ecosystem levels must not
  be mistaken for card plans.
- Sources: [current homepage](https://www.thorwallet.org/) and
  [legacy Mastercard guide](https://faqs.thorwallet.org/features/thorwallet-mastercard).

### 37. SafePal Card

- Underlying offering: SafePal-branded Fiat24 Swiss account and virtual Mastercard.
- Loyalty model: rolling account points from deposits, referrals, and locked SFP determine account
  tier; tier names and exact table remain image-only in the public guide.
- Benefits: lower crypto top-up fee (advertised as low as 0.4%), higher referral commissions, mobile
  wallets, and a long-term zero-deposit-fee waiver. Entravel hotel discount/cashback is a separate,
  time-sensitive partner benefit.
- Sources: [banking gateway](https://www.safepal.com/en/bank) and
  [tier introduction](https://www.safepal.com/en/blog/safepal-launches-1st-crypto-friendly-banking-gateway-and-visa-card).

### 38. UR Card

- Plan model: one free virtual multi-currency Mastercard; no physical card, PIN, or ATM access.
- Benefits: Apple Pay and Google Pay, multi-currency spend, and in-app controls. No official consumer
  cashback or rewards program was found.
- Source: [UR Mastercard guide](https://docs.ur.app/hc/en-us/articles/12916060053775-UR-Mastercard-Debit-Card).

### 39. SavePay Card

- Underlying offering: SavePay routes activation to Fiat24 and uses the Fiat24 card/account. It is a
  distribution/integration layer, not a wholly independent card scheme.
- Funding: docs describe USDC, USDT, and ETH activation with a minimum balance that varies by region.
- Publication gap: capture SavePay-specific top-up pricing and supported-country terms; inherit no
  reward or tier claim merely because Fiat24 is the provider.
- Sources: [card activation](https://savepay.gitbook.io/savepay/getting-started/activate-your-savepay-card)
  and [Swiss account](https://savepay.gitbook.io/savepay/product/swiss-iban-account).

### 40. imToken Card

- Program split required: imToken distributes multiple co-branded offerings, including a Fiat24
  debit product and a DCS Singapore credit card. “imToken Card” is not one offering.
- DCS economics: S$500 initial credit, 1% token top-up, S$30 annual fee after the first year,
  3.25% FX with a 1% rebate, and ATM/replacement fees.
- Benefits must be scoped to DCS or Fiat24; they cannot be merged.
- Sources: [card portfolio](https://www.token.im/card?locale=en),
  [DCS application](https://token.im/card/DCS/apply), and [DCS fees](https://token.im/card/DCS/fee).

### 41. TokenPocket Card

- Underlying offering: official flows and account NFT mechanics indicate a Fiat24-based virtual card.
- Benefits: Apple Pay, Google Pay, and Samsung Pay; no verified card cashback program was found.
- Publication gap: resolve the current fee schedule and exact regional eligibility from the official
  collapsed FAQ/in-app flow; avoid duplicating generic Fiat24 terms without partner-scope evidence.
- Source: [official card portal](https://card.tokenpocket.pro/?locale=en).

### 42. Bitget Wallet Card

- Regional split required: DCS issues the Asia offering, Fiat24 the Mainland China offering, and
  Immersve serves Europe/Latin America. Physical-card support is currently limited to named APAC markets.
- Benefits/economics: no annual fee; a monthly zero-fee allowance refunds FX/top-up/conversion fees;
  charges above the allowance vary by region, generally 1%-2.2%.
- Promotion: the public campaign describes a $400 monthly zero-fee allowance ($600 for a named prior
  campaign). Treat it as a dated benefit, not a permanent zero-fee fact.
- Sources: [card and FAQ](https://web3.bitget.com/card),
  [zero-fee campaign](https://web3.bitget.com/en/blog/articles/card-0-fees), and
  [regional application guide](https://web3.bitget.com/en/academy/how-to-apply-for-the-bitget-wallet-card-step-by-step-guide-for-new-users).

## Immediate catalog corrections before benefit UI expansion

- Rename `Premium` to `Kripicard` and `Ready Lite` to `Ready Card` at the program level.
- Split Coinbase debit/credit, Crypto.com prepaid/credit, Fold debit/credit, Wayex AU/global,
  imToken Fiat24/DCS, and Bitget Wallet regional issuers into offerings.
- Mark BitPay `paused_for_new_signups`, Cypher `winding_down`, and Plutus, Avici, TapX, and
  THORWallet lifecycle/source identity `unresolved` until their official evidence is reconciled.
- Remove stale global Binance Card claims; publish only the Brazil offering after its current fee and
  reward terms are captured.
- Model Ready, KAST, MetaMask, ether.fi, Wirex, COCA, RedotPay, Tria, Deblock, and Fiat24 plans inside
  one program rather than duplicating them in discovery.
- Add an independent loyalty/reward tier selector for Nexo, Bybit, Gnosis, Plutus, SafePal, Oobit,
  and other programs where the reward tier is not the card plan.

## Remaining evidence work

The audit is complete at the program level, but the following claims are intentionally not ready for
publication: image-only COCA and SafePal tier tables; current Binance Brazil fee/reward terms; Brighty
in-app plan prices/rates; KAST Season 5 dates; TapX domain/legal identity; Avici and THORWallet lifecycle;
Plutus post-Q2 card availability; and partner-specific fee schedules for SavePay and TokenPocket.
These should enter the research queue as candidate claims rather than being guessed or copied from a
third-party aggregator.
