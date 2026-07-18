import type { OfficialSourceDefinition } from "./priority-official-sources";

/**
 * Official sources for legacy snapshot entries whose plans, modes, or reward
 * levels were previously flattened into a single marketing-rate row.
 *
 * These definitions remain review-pending evidence. They are not public
 * catalog data and must be normalized and independently approved first.
 */
export const legacyTierSources: OfficialSourceDefinition[] = [
  {
    candidateKey: "nexo-card",
    slug: "nexo-card-product-2026",
    title: "Nexo Card",
    url: "https://nexo.com/crypto-card",
    authorityTier: "B",
    sourceType: "official issuer product, fee, and loyalty guide",
    facts: [
      { fieldKey: "card_modes", displayValue: "One card with switchable Credit and Debit modes", valueJson: { modes: ["Credit", "Debit"] }, scopeJson: { dimension: "card_mode", separateCards: false }, requiredTerms: ["Switch between Credit and Debit Mode", "Two ways to spend"] },
      { fieldKey: "loyalty_tier_base", displayValue: "Base: 0.5% NEXO or 0.1% BTC in Credit Mode", valueJson: { name: "Base", nexoPercent: 0.5, btcPercent: 0.1, tierOrder: 1 }, scopeJson: { dimension: "loyalty_tier", mode: "Credit", minimumPortfolioUsd: 5000 }, requiredTerms: ["Base: 0.5% in NEXO Tokens or 0.1% in BTC"] },
      { fieldKey: "loyalty_tier_silver", displayValue: "Silver: 0.7% NEXO or 0.2% BTC in Credit Mode", valueJson: { name: "Silver", nexoPercent: 0.7, btcPercent: 0.2, tierOrder: 2 }, scopeJson: { dimension: "loyalty_tier", mode: "Credit", minimumPortfolioUsd: 5000 }, requiredTerms: ["Silver: 0.7% in NEXO Tokens or 0.2% in BTC"] },
      { fieldKey: "loyalty_tier_gold", displayValue: "Gold: 1% NEXO or 0.3% BTC in Credit Mode", valueJson: { name: "Gold", nexoPercent: 1, btcPercent: 0.3, tierOrder: 3 }, scopeJson: { dimension: "loyalty_tier", mode: "Credit", minimumPortfolioUsd: 5000 }, requiredTerms: ["Gold: 1% in NEXO Tokens or 0.3% in BTC"] },
      { fieldKey: "loyalty_tier_platinum", displayValue: "Platinum: 2% NEXO or 0.5% BTC in Credit Mode", valueJson: { name: "Platinum", nexoPercent: 2, btcPercent: 0.5, tierOrder: 4 }, scopeJson: { dimension: "loyalty_tier", mode: "Credit", minimumPortfolioUsd: 5000 }, requiredTerms: ["Platinum: 2% in NEXO Tokens or 0.5% in BTC"] },
      { fieldKey: "atm_limits", displayValue: "Free monthly ATM allowance rises from €200/£180 at Base to €2,000/£1,800 at Platinum; 2% after allowance", valueJson: { Base: { eur: 200, gbp: 180 }, Silver: { eur: 400, gbp: 360 }, Gold: { eur: 1000, gbp: 900 }, Platinum: { eur: 2000, gbp: 1800 }, feeAfterPercent: 2 }, scopeJson: { dimension: "loyalty_tier", minimumFeeAfterAllowance: 1.99 }, requiredTerms: ["Up to €200", "Up to €2,000", "2% fee"] },
      { fieldKey: "fx_fee", displayValue: "EEA/UK/CH: 0.2% weekdays and 0.7% weekends; rest of world: 2% and 2.5%", valueJson: { eeaUkChWeekdayPercent: 0.2, eeaUkChWeekendPercent: 0.7, restOfWorldWeekdayPercent: 2, restOfWorldWeekendPercent: 2.5 }, scopeJson: { dayOfWeekSensitive: true }, requiredTerms: ["EEA/UK/CH: 0.2%", "EEA/UK/CH: 0.7%", "ROW: 2.5%"] },
      { fieldKey: "physical_card_qualification", displayValue: "Physical card requires more than $5,000 of assets and Gold or higher; virtual activation requires $50", valueJson: { physicalMinimumAssetsUsd: 5000, physicalMinimumTier: "Gold", virtualMinimumAssetsUsd: 50 }, scopeJson: { physicalAndVirtualDiffer: true }, requiredTerms: ["virtual Nexo Card can be activated", "physical card", "Gold Loyalty Tier"] },
    ],
  },
  {
    candidateKey: "cdc-visa",
    slug: "crypto-com-level-up-2026",
    title: "Crypto.com Level Up rewards and benefits",
    url: "https://help.crypto.com/en/articles/12017612-level-up-rewards-and-benefits",
    authorityTier: "B",
    sourceType: "official issuer membership, card, and benefit guide",
    facts: [
      { fieldKey: "membership_plans", displayValue: "Level Up has Basic, Plus, Pro, and Private plans", valueJson: { plans: ["Basic", "Plus", "Pro", "Private"] }, scopeJson: { dimension: "membership_level", currentNames: true }, requiredTerms: ["Basic (formerly Midnight)", "Plus (formerly Ruby)", "Pro (formerly Jade/Indigo)", "Private (formerly Icy/Rose/Obsidian)"] },
      { fieldKey: "qualification_paths", displayValue: "Plus and Pro can use a subscription or CRO stake/lock; availability varies by jurisdiction", scopeJson: { dimension: "membership_level", qualifyingDimensions: ["subscription", "CRO stake", "CRO lockup"] }, requiredTerms: ["option to subscribe to Level Up", "locking up or staking CRO", "vary by jurisdiction"] },
      { fieldKey: "private_levels", displayValue: "Private retains separate $50,000 and $500,000 CRO qualification levels", valueJson: { levelsUsd: [50000, 500000] }, scopeJson: { dimension: "membership_level", plan: "Private", nestedQualificationLevels: true }, requiredTerms: ["Private - US$50,000", "Private - US$500,000"] },
      { fieldKey: "prepaid_card_reward", displayValue: "Prepaid Card spending rewards can reach 5%, uncapped; exact rates and availability vary by jurisdiction", valueJson: { maximumPercent: 5 }, scopeJson: { product: "Crypto.com Prepaid Card", jurisdictionSpecific: true, exactTierMatrixRequiresRegionalSource: true }, requiredTerms: ["Up to 5% uncapped rewards on spending with the Crypto.com Prepaid Card", "vary by jurisdiction"] },
      { fieldKey: "credit_card_boundary", displayValue: "U.S. Visa Signature credit card is a separate product with rewards up to 6%", valueJson: { maximumPercent: 6 }, scopeJson: { country: "US", product: "Crypto.com Visa Signature Credit Card", canonicalProgramMustNotMergeWith: "Crypto.com Prepaid Card" }, requiredTerms: ["Up to 6% uncapped rewards", "US users only"] },
      { fieldKey: "benefit_categories", displayValue: "Level Up can include trading, stock-transfer, cash-balance, card-spend, CRO-deposit, support, and partner-experience benefits", scopeJson: { dimension: "membership_level", exactBenefitAvailabilityVaries: true }, requiredTerms: ["Zero trading fees", "bonus on stock transfers", "priority customer support"] },
    ],
  },
  {
    candidateKey: "ready-lite",
    slug: "ready-card-plans-2026",
    title: "Ready Card perks and benefits FAQ",
    url: "https://help.ready.co/hc/en-us/articles/28160227272349-Ready-Card-perks-and-benefits-FAQ",
    authorityTier: "B",
    sourceType: "official issuer plan and benefit guide",
    facts: [
      { fieldKey: "program_identity", displayValue: "Ready Card is one program with Lite and Metal plans", valueJson: { plans: ["Lite", "Metal"] }, scopeJson: { dimension: "card_plan", separateCatalogCards: false }, requiredTerms: ["Metal", "Lite", "Fully self-custodial"] },
      { fieldKey: "plan_lite", displayValue: "Lite: free plastic card; $6.99 shipping; 2% ATM fee; 1% FX fee; no premium perks", valueJson: { name: "Lite", annualFee: 0, shippingFee: 6.99, atmFeePercent: 2, fxFeePercent: 1, premiumPerks: false }, scopeJson: { dimension: "card_plan", rewardProgram: "Ready Rewards" }, requiredTerms: ["$6.99", "2% to the min of $1", "1% FX fee for Lite"] },
      { fieldKey: "plan_metal", displayValue: "Metal: $120/year; express shipping included; first $800 ATM monthly free; no FX fee; partner perks", valueJson: { name: "Metal", annualFee: 120, shippingFee: 0, monthlyFreeAtmUsd: 800, fxFeePercent: 0, premiumPerks: true }, scopeJson: { dimension: "card_plan", rewardProgram: "Ready Rewards" }, requiredTerms: ["$120/year", "Withdraw up to $800/month for free", "no FX fees for Metal"] },
      { fieldKey: "ready_rewards_metal", displayValue: "Metal earns 3 points per $1 of card spend and 0.6 points per $1 of in-app token trades; boosts can raise card earn to 9 points per $1", valueJson: { cardPointsPerUsd: 3, tradePointsPerUsd: 0.6, maximumBoostedCardPointsPerUsd: 9 }, scopeJson: { dimension: "card_plan", plan: "Metal", program: "Ready Rewards", notCashbackPercent: true }, requiredTerms: ["3 pts / $1", "0.6 pts / $1", "up to 9 points for every $1 spent"] },
      { fieldKey: "ready_rewards_lite", displayValue: "Lite card spend is not eligible for points; in-app token trades earn 0.3 points per $1", valueJson: { cardSpendEligible: false, tradePointsPerUsd: 0.3 }, scopeJson: { dimension: "card_plan", plan: "Lite", program: "Ready Rewards", notCashbackPercent: true }, requiredTerms: ["Lite Card", "Card spend", "Not eligible", "0.3 pts / $1"] },
      { fieldKey: "ready_rewards_redemption", displayValue: "Points can refund a full eligible card purchase into USDC after settlement and a seven-day grace period", valueJson: { rewardAsset: "USDC", gracePeriodDays: 7, partialPurchaseRefund: false }, scopeJson: { program: "Ready Rewards", pointsCurrentlyDoNotExpire: true }, requiredTerms: ["Tap Pay with Points", "Receive USDC back", "7-day grace period", "do not expire"] },
      { fieldKey: "future_subscription_benefit", displayValue: "Announced, not live: 25% back in points on Claude, Netflix, and Spotify subscriptions", valueJson: { percentBackInPoints: 25, brands: ["Claude", "Netflix", "Spotify"] }, scopeJson: { lifecycle: "ANNOUNCED", publishAsCurrent: false }, requiredTerms: ["COMING SOON: Discounted subscriptions", "Claude, Netflix, or Spotify", "25%"] },
      { fieldKey: "metal_partner_perks", displayValue: "Metal partner offers include Ramp 30% fee discount, Layerswap fee refunds, Koinly 20%, Nansen 25%, StarknetID 50%, Airalo 15%, and an extra NordVPN 5%", valueJson: { Ramp: "30% off fees", Layerswap: "100% off bridging fees up to $100/month", Koinly: "20% off 2025 tax plan", Nansen: "25% off", StarknetID: "50% off domains for 12 months", Airalo: "15% off eSIMs", NordVPN: "additional 5% off two-year plans" }, scopeJson: { dimension: "card_plan", plan: "Metal", partnerTermsApply: true, benefitsMayChange: true }, requiredTerms: ["Ramp Network – 30% Off Fees", "Layerswap – Free Bridging", "Koinly – 20%", "Nansen – 25%", "StarknetID – 50%", "Airalo – 15%", "additional 5% off NordVPN"] },
      { fieldKey: "mobile_wallet", displayValue: "Google Pay is live; Apple Pay is listed as coming soon", scopeJson: { googlePay: "LIVE", applePay: "ANNOUNCED" }, requiredTerms: ["Apple Pay", "Coming soon", "Google Pay"] },
    ],
  },
  {
    candidateKey: "plutus-card",
    slug: "plutus-plans-and-levels-2026",
    title: "Plutus plans and reward levels",
    url: "https://www.plutus.it/plans",
    authorityTier: "B",
    sourceType: "official issuer subscription, loyalty, and perk guide",
    facts: [
      { fieldKey: "subscription_starter", displayValue: "Starter: £/€6.99 monthly; 3% on £/€250; one perk", valueJson: { name: "Starter", monthlyFee: 6.99, rewardPercent: 3, monthlyEligibleSpend: 250, perks: 1 }, scopeJson: { dimension: "subscription" }, requiredTerms: ["Starter", "6.99", "250 monthly spending", "1 perk"] },
      { fieldKey: "subscription_everyday", displayValue: "Everyday: £/€9.99 monthly; 3% on £/€500; two perks", valueJson: { name: "Everyday", monthlyFee: 9.99, rewardPercent: 3, monthlyEligibleSpend: 500, perks: 2 }, scopeJson: { dimension: "subscription" }, requiredTerms: ["Everyday", "9.99", "500 monthly spending", "2 perks"] },
      { fieldKey: "subscription_premium", displayValue: "Premium: £/€19.99 monthly; 3% on £/€1,000; three perks", valueJson: { name: "Premium", monthlyFee: 19.99, rewardPercent: 3, monthlyEligibleSpend: 1000, perks: 3 }, scopeJson: { dimension: "subscription" }, requiredTerms: ["Premium", "19.99", "1,000 monthly spending", "3 perks"] },
      { fieldKey: "reward_levels", displayValue: "Separate PLU-stack levels run from Noob (1 PLU, 3%) through Honey Badger (40,000 PLU, 9%)", valueJson: { levels: [{ name: "Noob", plu: 1, rewardPercent: 3 }, { name: "Researcher", plu: 100, rewardPercent: 3 }, { name: "Explorer", plu: 200, rewardPercent: 3 }, { name: "Adventurer", plu: 500, rewardPercent: 3 }, { name: "Chad", plu: 1000, rewardPercent: 3 }, { name: "Hero", plu: 2000, rewardPercent: 4 }, { name: "Veteran", plu: 3000, rewardPercent: 5 }, { name: "Legend", plu: 10000, rewardPercent: 6 }, { name: "Myth", plu: 20000, rewardPercent: 7 }, { name: "GOAT", plu: 30000, rewardPercent: 8 }, { name: "Honey Badger", plu: 40000, rewardPercent: 9 }] }, scopeJson: { dimension: "loyalty_level", combinesWith: "subscription" }, requiredTerms: ["Noob", "Honey Badger", "40,000 PLU", "9%"] },
      { fieldKey: "dimension_relationship", displayValue: "A subscription is required; PLU reward levels separately raise reward rate and add perks", scopeJson: { dimensions: ["subscription", "loyalty_level"], composable: true }, requiredTerms: ["must sign up for a monthly subscription plan", "Stack your earned PLU"] },
    ],
  },
  {
    candidateKey: "wirex-card",
    slug: "wirex-xtras-plans-tiers-2026",
    title: "Wirex X-tras pricing plans and tiers",
    url: "https://help.wirexapp.com/article/x-tras-pricing-plans-and-tiers-1337",
    authorityTier: "B",
    sourceType: "official issuer subscription and boost-tier guide",
    facts: [
      { fieldKey: "subscription_plans", displayValue: "Standard is free; Premium costs €9.99/month or €102/year; Elite costs €29.99/month or €306/year", valueJson: { plans: [{ name: "Standard", monthlyFee: 0 }, { name: "Premium", monthlyFee: 9.99, annualFee: 102 }, { name: "Elite", monthlyFee: 29.99, annualFee: 306 }] }, scopeJson: { dimension: "subscription" }, requiredTerms: ["Standard plan", "€9.99", "€102", "€29.99", "€306"] },
      { fieldKey: "boost_tiers", displayValue: "Nested Entry, Enhanced, and Ultimate boost tiers use 180-day WXT locks", valueJson: { Standard: { Entry: { wxt: 0, rewardPercent: 0.5 }, Enhanced: { wxt: 150000, rewardPercent: 1 } }, Premium: { Entry: { wxt: 0, rewardPercent: 1 }, Enhanced: { wxt: 250000, rewardPercent: 2 }, Ultimate: { wxt: 750000, rewardPercent: 3 } }, Elite: { Entry: { wxt: 0, rewardPercent: 4 }, Enhanced: { wxt: 1500000, rewardPercent: 6 }, Ultimate: { wxt: 7500000, rewardPercent: 8 } } }, scopeJson: { dimension: "loyalty_tier", optionNames: ["Entry", "Enhanced", "Ultimate"], combinesWith: "subscription", lockDays: 180 }, requiredTerms: ["locking 150,000 WXT tokens for 180 days", "250,000 WXT", "750,000 WXT", "1,500,000 WXT", "7,500,000 WXT"] },
      { fieldKey: "dimension_relationship", displayValue: "Card rewards depend on both X-tras subscription and its nested boost tier", scopeJson: { dimensions: ["subscription", "loyalty_tier"], composable: true }, requiredTerms: ["three different X-tras subscription plans", "Each subscription plan has its own set of tiers"] },
    ],
  },
  {
    candidateKey: "bitpanda-card",
    slug: "bitpanda-card-benefits-2026",
    title: "Bitpanda Card benefits",
    url: "https://support.bitpanda.com/hc/en-us/articles/360018933120-What-is-the-Bitpanda-Card-and-what-are-its-benefits",
    authorityTier: "B",
    sourceType: "official issuer current product and reward guide",
    facts: [
      { fieldKey: "card_count", displayValue: "Physical and virtual-only cards are available, with up to three active cards", valueJson: { maximumActiveCards: 3 }, scopeJson: { forms: ["physical", "virtual"] }, requiredTerms: ["virtual-only card", "up to three active cards"] },
      { fieldKey: "reward_current", displayValue: "Eligible crypto-funded purchases earn 1% in the selected spending asset", valueJson: { rewardPercent: 1 }, scopeJson: { cryptoFundingRequired: true, stablecoinsExcluded: true, exactMccExclusionsApply: true }, requiredTerms: ["cashback advantage: 1%", "selected asset", "does not apply to transactions funded with Stablecoins"] },
      { fieldKey: "card_fees", displayValue: "Card payments incur the normal asset-to-fiat trading fee; ATM costs 2% or at least €2; no extra non-EUR payment or withdrawal fee", valueJson: { atmPercent: 2, minimumAtmFee: 2, minimumAtmFeeCurrency: "EUR", nonEurIssuerFeePercent: 0 }, scopeJson: { atmOperatorFeeMayApply: true }, requiredTerms: ["usual trading fee", "ATM withdrawals cost 2%", "non-EUR currencies no longer incur any fees"] },
      { fieldKey: "mobile_wallet", displayValue: "Apple Pay and Google Pay are both available", scopeJson: { googlePay: "LIVE", applePay: "LIVE" }, requiredTerms: ["added to Google Pay and Apple Pay"] },
    ],
  },
  {
    candidateKey: "whitebit-card",
    slug: "whitebit-nova-fees-limits-2026",
    title: "WhiteBIT Nova fees, limits, and restricted MCCs",
    url: "https://help.whitebit.com/hc/en-gb/articles/35509838215197-N%C3%B3va-Card-Fees-Limits-and-Restricted-MCCs",
    authorityTier: "B",
    sourceType: "official issuer fee and limit guide",
    facts: [
      { fieldKey: "card_fees", displayValue: "No monthly, inactivity, or cancellation fee; transactions can cost up to 1%", valueJson: { monthlyFee: 0, inactivityFee: 0, cancellationFee: 0, maximumTransactionFeePercent: 1 }, scopeJson: { physicalAndDigital: true }, requiredTerms: ["Inactivity fee", "Monthly payment", "Transaction fees"] },
      { fieldKey: "atm_fee", displayValue: "Physical card ATM: €3 in EEA; €3 + 2.2% outside EEA", valueJson: { eeaFixedFee: 3, nonEeaFixedFee: 3, nonEeaPercent: 2.2, currency: "EUR" }, scopeJson: { physicalCardOnly: true }, requiredTerms: ["ATM cash withdrawal fee (EEA)", "2.2%"] },
      { fieldKey: "spend_limits", displayValue: "€10,000 daily and €25,000 monthly spend limits", valueJson: { daily: 10000, monthly: 25000, currency: "EUR" }, scopeJson: { physicalAndDigital: true }, requiredTerms: ["Maximum daily amount available for spending", "Maximum monthly amount available for spending"] },
      { fieldKey: "atm_limits", displayValue: "Physical-card ATM limit: €1,000 daily and €3,000 monthly", valueJson: { daily: 1000, monthly: 3000, currency: "EUR" }, scopeJson: { physicalCardOnly: true, contactWithdrawalOnly: true }, requiredTerms: ["Daily ATM cash withdrawal limit", "Monthly ATM cash withdrawal limit"] },
    ],
  },
  {
    candidateKey: "whitebit-card",
    slug: "whitebit-nova-cashback-2026",
    title: "WhiteBIT Nova cashback categories and MCCs",
    url: "https://help.whitebit.com/hc/en-gb/articles/35509494697757-N%C3%B3va-Card-Cashback-Categories-and-MCC-List",
    authorityTier: "B",
    sourceType: "official issuer dynamic reward guide",
    facts: [
      { fieldKey: "reward_categories", displayValue: "Select three active cashback categories; rates are dynamic in-app", valueJson: { activeCategoryCount: 3, categoryChangeCooldownDays: 7 }, scopeJson: { dimension: "reward_offer", exactRatePubliclyUnknown: true, categoryBased: true }, requiredTerms: ["select 3 active categories", "cashback % can change dynamically", "once every 7 days"] },
      { fieldKey: "reward_cap", displayValue: "€25 maximum cashback per month; withdrawal starts at 5 USDC; reward may be BTC or WBT", valueJson: { monthlyCap: 25, capCurrency: "EUR", minimumRedemption: 5, redemptionCurrency: "USDC", rewardChoices: ["BTC", "WBT"] }, scopeJson: { eligibleMccRequired: true }, requiredTerms: ["maximum cashback limit is 25 EUR", "at least 5 USDC", "BTC or WBT"] },
      { fieldKey: "welcome_promotion", displayValue: "New users can receive 5% on their first transaction from 22 May 2026", valueJson: { rewardPercent: 5, effectiveFrom: "2026-05-22" }, scopeJson: { lifecycle: "PROMOTION", newUsersOnly: true, firstTransactionOnly: true }, requiredTerms: ["Starting from 22.05.2026", "5% cashback on the first transaction"] },
    ],
  },
  {
    candidateKey: "redotpay-card",
    slug: "redotpay-pro-2026",
    title: "RedotPay Pro membership",
    url: "https://helpcenter.redotpay.com/en/articles/14686020-getting-started-with-redotpay-pro",
    authorityTier: "B",
    sourceType: "official issuer membership and benefit guide",
    facts: [
      { fieldKey: "membership_billing", displayValue: "One Pro membership with $12.90 monthly or $129 annual billing", valueJson: { name: "Pro", monthlyFee: 12.9, annualFee: 129 }, scopeJson: { dimension: "subscription", billingTermsNotBenefitTiers: true }, requiredTerms: ["Monthly Membership: $12.90", "Annual Membership: $129.00"] },
      { fieldKey: "monthly_benefits", displayValue: "Monthly Pro waives one $10 virtual-card application fee and adds 3% mobile-wallet cashback up to $18/month", valueJson: { virtualCardFeeWaiver: 10, rewardPercent: 3, monthlyRewardCap: 18 }, scopeJson: { billingTerm: "monthly", eligibleWallets: ["Apple Pay", "Google Pay"] }, requiredTerms: ["one-time waiver of the $10", "3% cashback", "up to $18 per month"] },
      { fieldKey: "annual_benefits", displayValue: "Annual Pro waives one $100 physical-card fee, adds the same cashback, waives issuer ATM fees on $1,000/month, and adds 1% APY", valueJson: { physicalCardFeeWaiver: 100, rewardPercent: 3, monthlyRewardCap: 18, monthlyAtmWaiverUsd: 1000, additionalApyPercent: 1 }, scopeJson: { billingTerm: "annual", regionAvailabilityAppliesToEarn: true }, requiredTerms: ["one-time waiver of the $100", "$1,000 monthly", "additional +1% APY"] },
      { fieldKey: "reward_restrictions", displayValue: "Cashback is USDs for future card spending only, expires after 30 days, and is not withdrawable or transferable", valueJson: { rewardAsset: "USDs", expiryDays: 30 }, scopeJson: { cardSpendOnly: true, withdrawable: false, transferable: false }, requiredTerms: ["Cashback is issued in USDs", "expire after 30 days", "can't be withdrawn, transferred"] },
    ],
  },
  {
    candidateKey: "ledger-card",
    slug: "ledger-cl-card-2026",
    title: "CL Card compatible with Ledger",
    url: "https://shop.ledger.com/pages/cl-card-crypto-card",
    authorityTier: "B",
    sourceType: "official brand product, reward, and provider guide",
    facts: [
      { fieldKey: "provider_relationship", displayValue: "Baanx provides the CL Card; it is designed for Ledger", scopeJson: { brand: "Ledger", provider: "Baanx" }, requiredTerms: ["CL Card, provided by Baanx", "designed for Ledger"] },
      { fieldKey: "reward", displayValue: "1% cashback: BTC or USDC in the U.S.; BTC or USDT elsewhere", valueJson: { rewardPercent: 1, usAssets: ["BTC", "USDC"], otherAssets: ["BTC", "USDT"] }, scopeJson: { noStakingRequired: true, regionSpecificRewardAsset: true }, requiredTerms: ["1% cashback in BTC or USDC in the US", "1% cashback in BTC or USDT"] },
      { fieldKey: "card_type", displayValue: "Free virtual debit card", valueJson: { virtualFee: 0 }, scopeJson: { form: "virtual" }, requiredTerms: ["Free virtual card", "debit card"] },
      { fieldKey: "funding_model", displayValue: "Card must be funded before spending; crypto transfers from Ledger Wallet to the card account", scopeJson: { prefundingRequired: true, cardAccountCustodial: true }, requiredTerms: ["need to fund your CL Card before", "fund the card with the crypto"] },
      { fieldKey: "mobile_wallet", displayValue: "Apple Pay and Google Pay", scopeJson: { applePay: true, googlePay: true }, requiredTerms: ["Apple Pay and Google Pay"] },
    ],
  },
];

export const legacyTierCandidateKeys = [...new Set(legacyTierSources.map(({ candidateKey }) => candidateKey))];
