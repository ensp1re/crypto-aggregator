import type { Prisma } from "@/generated/prisma/client";
import { catalogExpansionSources } from "./catalog-expansion-sources";
import { finalCatalogSources } from "./final-catalog-sources";
import { legacyTierSources } from "./legacy-tier-sources";
import { remainingCatalogSources } from "./remaining-catalog-sources";

export type OfficialFact = {
  fieldKey: string;
  displayValue: string;
  valueJson?: Prisma.InputJsonValue;
  scopeJson: Prisma.InputJsonObject;
  requiredTerms: string[];
};

export type OfficialSourceDefinition = {
  candidateKey: string;
  slug: string;
  title: string;
  url: string;
  authorityTier: "A" | "B";
  sourceType: string;
  facts: OfficialFact[];
};

const initialOfficialSources: OfficialSourceDefinition[] = [
  {
    candidateKey: "metamask-card",
    slug: "metamask-card-overview",
    title: "What is MetaMask Card?",
    url: "https://support.metamask.io/trade/metamask-card/what-is-metamask-card/",
    authorityTier: "B",
    sourceType: "official issuer help center",
    facts: [
      { fieldKey: "card_type", displayValue: "Debit Mastercard", scopeJson: { product: "MetaMask Card" }, requiredTerms: ["self-custodial MetaMask wallet", "Mastercard transactions"] },
      { fieldKey: "funding_model", displayValue: "Self-custodial wallet; enabled tokens convert to fiat at purchase", scopeJson: { product: "MetaMask Card" }, requiredTerms: ["complete control over your funds", "converts your available tokens into fiat currency"] },
      { fieldKey: "signup_status", displayValue: "New U.S. and U.K. sign-ups temporarily paused; existing holders unaffected", scopeJson: { countries: ["US", "GB"], status: "PAUSED_FOR_NEW_SIGNUPS" }, requiredTerms: ["temporarily paused new Card sign-ups in the United States and the United Kingdom", "Existing Card holders are not affected"] },
    ],
  },
  {
    candidateKey: "metamask-card",
    slug: "metamask-card-faq",
    title: "MetaMask Card FAQs",
    url: "https://support.metamask.io/trade/metamask-card/card-faq/",
    authorityTier: "B",
    sourceType: "official issuer help center",
    facts: [
      { fieldKey: "virtual_annual_fee", displayValue: "Virtual: verified explicit zero annual and maintenance fee", valueJson: { name: "Virtual", tierOrder: 1, amount: 0, currency: "USD", period: "year" }, scopeJson: { plan: "Virtual", dimension: "card_plan", lifecycle: "LIVE" }, requiredTerms: ["Virtual card has no annual fees", "maintenance fees"] },
      { fieldKey: "metal_annual_fee", displayValue: "Metal: $199 per year; new orders paused", valueJson: { name: "Metal", tierOrder: 2, amount: 199, currency: "USD", period: "year" }, scopeJson: { plan: "Metal", dimension: "card_plan", country: "US", lifecycle: "PAUSED", availability: "orders paused 2026-06-02" }, requiredTerms: ["Metal card has an annual fee of $199", "temporarily paused"] },
      { fieldKey: "reward_rate", displayValue: "Virtual 1% mUSD; Metal 3% on first $10,000 yearly, then 1%", valueJson: { virtualPercent: 1, metalInitialPercent: 3, metalThresholdUsd: 10000, metalAfterPercent: 1 }, scopeJson: { eligibleTransactionsOnly: true }, requiredTerms: ["Virtual card transactions earn 1% mUSD back", "first $10,000 spent each year"] },
      { fieldKey: "fx_fee", displayValue: "No additional MetaMask foreign transaction fee; Mastercard rate applies", valueJson: { issuerMarkupPercent: 0 }, scopeJson: { networkRateApplies: true }, requiredTerms: ["doesn’t charge any additional fees", "MasterCard"] },
      { fieldKey: "provider_relationship", displayValue: "Baanx provider; Monovate issuer; Mastercard network", scopeJson: { region: "source does not fully distinguish issuer entity by region" }, requiredTerms: ["Baanx is the provider", "Monovate is the card issuer", "Mastercard operates the payment network"] },
    ],
  },
  {
    candidateKey: "etherfi-card",
    slug: "etherfi-cash-faq",
    title: "ether.fi Cash frequently asked questions",
    url: "https://help.ether.fi/en/articles/262378-frequently-asked-questions",
    authorityTier: "B",
    sourceType: "official issuer help center",
    facts: [
      { fieldKey: "card_type", displayValue: "Visa credit card", scopeJson: { product: "ether.fi Cash personal" }, requiredTerms: ["crypto-native credit card", "Visa credit card"] },
      { fieldKey: "kyc", displayValue: "Identity verification required", scopeJson: { onboarding: true }, requiredTerms: ["Verify your identity via KYC"] },
    ],
  },
  {
    candidateKey: "etherfi-card",
    slug: "etherfi-cash-fees-limits",
    title: "ether.fi Cash personal transaction limits and fees",
    url: "https://help.ether.fi/en/articles/303623-what-are-the-transaction-limits-and-fees-for-personal-cash-credit-cards",
    authorityTier: "B",
    sourceType: "official issuer fee and limit guide",
    facts: [
      { fieldKey: "spend_limit", displayValue: "Core $30k/day; Luxe $50k/day; Pinnacle $100k/day", valueJson: { plans: [{ name: "Core", tierOrder: 1, dailySpendLimit: 30000 }, { name: "Luxe", tierOrder: 2, dailySpendLimit: 50000 }, { name: "Pinnacle", tierOrder: 3, dailySpendLimit: 100000 }, { name: "VIP", tierOrder: 4, dailySpendLimit: 100000 }], currency: "USD", period: "day" }, scopeJson: { product: "personal Cash", dimension: "card_plan" }, requiredTerms: ["$30k/day", "$50k/day", "$100k/day"] },
      { fieldKey: "atm_fee", displayValue: "2% per withdrawal; $250 and three-attempt rolling daily limit", valueJson: { feePercent: 2, limit: 250, currency: "USD", attempts: 3, period: "rolling 24 hours" }, scopeJson: { tiers: ["Core", "Luxe", "Pinnacle"] }, requiredTerms: ["2% ATM fee per withdrawal", "max of 3 attempts"] },
      { fieldKey: "fx_fee", displayValue: "Core 0-0.5%; Luxe 0-0.25%; Pinnacle and VIP no added margin", valueJson: { Core: "0-0.5%", Luxe: "0-0.25%", Pinnacle: "0%", VIP: "0%" }, scopeJson: { baseRateAlsoApplies: true }, requiredTerms: ["Core", "0-0.5%", "Pinnacle", "None"] },
    ],
  },
  {
    candidateKey: "etherfi-card",
    slug: "etherfi-cash-cashback",
    title: "How ether.fi Cash cashback works",
    url: "https://help.ether.fi/en/articles/262374-how-does-cashback-work",
    authorityTier: "B",
    sourceType: "official issuer reward guide",
    facts: [
      { fieldKey: "reward_rate", displayValue: "Progressive 3%, 1%, then 0.5%; EUR upper band falls to 0.1%", valueJson: { bandsPercent: [3, 1, 0.5], eurUpperBandPercent: 0.1, rewardAsset: "USDC" }, scopeJson: { tierThresholdsDiffer: true, excludedMccsApply: true }, requiredTerms: ["3%", "0.5%", "credited to your account as USDC"] },
    ],
  },
  {
    candidateKey: "etherfi-card",
    slug: "etherfi-cash-regions",
    title: "Where ether.fi is currently unavailable",
    url: "https://help.ether.fi/en/articles/262373-where-is-ether-fi-currently-unavailable",
    authorityTier: "B",
    sourceType: "official issuer eligibility guide",
    facts: [
      { fieldKey: "eligibility_scope", displayValue: "Availability is exclusion-based and requires proof of residence; official restricted-country and U.S.-state lists apply", scopeJson: { exactEligibleCountriesNotAsserted: true }, requiredTerms: ["Prohibited Jurisdictions", "U.S. States", "proof of address"] },
    ],
  },
  {
    candidateKey: "gnosis-card",
    slug: "gnosis-pay-overview",
    title: "What is Gnosis Pay?",
    url: "https://help.gnosispay.com/hc/en-us/articles/39388201965332-What-is-Gnosis-Pay",
    authorityTier: "B",
    sourceType: "official issuer help center",
    facts: [
      { fieldKey: "card_type", displayValue: "Self-custodial Visa debit card", scopeJson: { product: "Gnosis Pay Card" }, requiredTerms: ["self-custodial crypto debit card", "Visa debit card"] },
      { fieldKey: "funding_model", displayValue: "Stablecoins remain in the user-controlled Gnosis Safe until spending", scopeJson: { chain: "Gnosis Chain" }, requiredTerms: ["does not require you to move funds into a custodial account", "remain in your wallet until the moment you spend"] },
    ],
  },
  {
    candidateKey: "gnosis-card",
    slug: "gnosis-pay-eligible-countries",
    title: "Eligible Countries for Gnosis Pay",
    url: "https://help.gnosispay.com/hc/en-us/articles/39401751918612-Eligible-Countries-for-Gnosis-Pay",
    authorityTier: "B",
    sourceType: "official issuer eligibility guide",
    facts: [
      { fieldKey: "eligibility_scope", displayValue: "Legal residents of listed European and Latin American countries", scopeJson: { residencyRequired: true, listObserved: "2026-07-17", waitlistSeparate: true }, requiredTerms: ["Current Supported Countries of Residency", "Countries Coming Soon", "legal residents"] },
    ],
  },
  {
    candidateKey: "gnosis-card",
    slug: "gnosis-pay-fees-limits",
    title: "Understanding Your Gnosis Pay Card's Fees and Limits",
    url: "https://help.gnosispay.com/hc/en-us/articles/39533569163284-Understanding-Your-Card-s-Fees-and-Limits",
    authorityTier: "B",
    sourceType: "official issuer fee and limit guide",
    facts: [
      { fieldKey: "issuance_fee", displayValue: "Verified explicit zero for initial card order and shipping", valueJson: { amount: 0 }, scopeJson: { replacementExcluded: true }, requiredTerms: ["Card Order", "FREE shipping"] },
      { fieldKey: "fx_fee", displayValue: "No added Gnosis Pay FX fee; Visa exchange rate applies", valueJson: { issuerMarkupPercent: 0 }, scopeJson: { networkRateApplies: true }, requiredTerms: ["No added fees from Gnosis Pay", "Visa’s exchange rate"] },
      { fieldKey: "atm_fee", displayValue: "Five withdrawals or 200 units monthly free, then 2%; 500 daily and 250 single limit", valueJson: { freeWithdrawalCount: 5, freeAmount: 200, feeAfterPercent: 2, dailyLimit: 500, singleLimit: 250 }, scopeJson: { currencies: ["EURe", "GBPe", "USDCe"] }, requiredTerms: ["5 free ATM withdrawals", "2% fee", "Daily Withdrawal Limit"] },
      { fieldKey: "spend_limit", displayValue: "8,000 daily; 5,000 per transaction", valueJson: { daily: 8000, single: 5000 }, scopeJson: { currencies: ["EURe", "GBPe", "USDCe"] }, requiredTerms: ["Daily Spending Limit", "8,000", "Single Transaction Limit"] },
    ],
  },
  {
    candidateKey: "gnosis-card",
    slug: "gnosis-pay-cashback-2026",
    title: "Gnosis Pay Intermediary Cashback Programme",
    url: "https://help.gnosispay.com/hc/en-us/articles/40288567337876-Intermediary-Cashback-Programme",
    authorityTier: "B",
    sourceType: "official issuer time-limited reward terms",
    facts: [
      { fieldKey: "reward_rate", displayValue: "1-4% base plus 1% OG NFT bonus; GNO balance tiers and weekly caps; ends 30 Sep 2026", valueJson: { basePercentRange: [1, 4], ogBonusPercent: 1, maximumPercent: 5, endDate: "2026-09-30", maximumEligibleWeeklySpendUsd: 1250 }, scopeJson: { gnoHoldingRequired: true, eligibleTransactionsOnly: true, temporaryProgramme: true }, requiredTerms: ["30 September 2026", "4% base + 1% OG NFT bonus", "Weekly cap"] },
    ],
  },
  {
    candidateKey: "gnosis-card",
    slug: "gnosis-pay-terms",
    title: "Gnosis Pay Terms of Service",
    url: "https://help.gnosispay.com/hc/en-us/articles/43350967419412-Gnosis-Pay-Terms-of-Service",
    authorityTier: "A",
    sourceType: "official legal terms",
    facts: [
      { fieldKey: "issuer_relationship", displayValue: "Visa card issued by regional Monavate entity; Gnosis Pay company differs by EEA scope", scopeJson: { regionalEntityResolutionRequired: true }, requiredTerms: ["Visa payment card issued to you by Monavate", "resident in the EEA"] },
    ],
  },
  {
    candidateKey: "solflare-card",
    slug: "solflare-card-faq",
    title: "Solflare Card FAQ",
    url: "https://www.solflare.com/crypto-card/faq/",
    authorityTier: "B",
    sourceType: "official issuer product FAQ",
    facts: [
      { fieldKey: "card_type", displayValue: "Virtual Mastercard debit card", scopeJson: { product: "Solflare Card", physicalCard: "announced, not currently asserted" }, requiredTerms: ["Mastercard debit virtual card", "physical card", "soon"] },
      { fieldKey: "funding_model", displayValue: "USDC spends directly from a delegated self-custodial Solflare wallet", scopeJson: { asset: "USDC", prefundingRequired: false }, requiredTerms: ["spend your USDC directly from your Solflare wallet", "don't need to load funds"] },
      { fieldKey: "supported_assets", displayValue: "USDC only", valueJson: { assets: ["USDC"] }, scopeJson: { additionalAssets: "announced, not current" }, requiredTerms: ["only spend USDC", "enabling other assets soon"] },
      { fieldKey: "eligibility_scope", displayValue: "EEA and UK residents aged 18+, plus case-by-case countries", scopeJson: { regions: ["EEA", "GB"], minimumAge: 18, partnerApprovalRequired: true }, requiredTerms: ["residents aged 18 or over", "EEA", "case-by-case"] },
      { fieldKey: "kyc", displayValue: "Government ID and personal information required", scopeJson: { identityVerification: true }, requiredTerms: ["government ID document", "prove my identity"] },
      { fieldKey: "fx_fee", displayValue: "Mastercard interbank rate; Solflare international fee may apply", scopeJson: { exactIssuerFee: "not disclosed in FAQ" }, requiredTerms: ["Mastercard at the interbank rate", "may charge international transaction fees"] },
      { fieldKey: "atm_fee", displayValue: "No Solflare ATM fee; operator fee may apply", valueJson: { issuerFeePercent: 0 }, scopeJson: { operatorFeeMayApply: true }, requiredTerms: ["doesn’t charge ATM fees", "ATM operators"] },
      { fieldKey: "mobile_wallet", displayValue: "Google Pay and Apple Pay device verification supported", scopeJson: { exactPlatformAvailabilityRequiresReview: true }, requiredTerms: ["Google Pay or Apple Pay"] },
    ],
  },
  {
    candidateKey: "trustee-plus-card",
    slug: "trustee-plus-commissions",
    title: "Trustee Plus Commissions",
    url: "https://trustee.io/wiki/trustee-plus/trustee-plus-commissions/",
    authorityTier: "B",
    sourceType: "official issuer fee guide",
    facts: [
      { fieldKey: "issuance_fee", displayValue: "$10", valueJson: { amount: 10, currency: "USD" }, scopeJson: { product: "Trustee Plus crypto card" }, requiredTerms: ["issuance fee is 10$"] },
      { fieldKey: "top_up_fee", displayValue: "0.5% for USDC card-balance top-up", valueJson: { rate: 0.5, unit: "percent", asset: "USDC" }, scopeJson: { method: "card balance top-up" }, requiredTerms: ["Top-up fee", "0.5%"] },
      { fieldKey: "card_payment_fee", displayValue: "Verified explicit zero", valueJson: { amount: 0, unit: "percent" }, scopeJson: { goodsAndServices: true }, requiredTerms: ["goods and services", "0%"] },
      { fieldKey: "atm_availability", displayValue: "ATM withdrawals unavailable", scopeJson: { status: "NOT_OFFERED" }, requiredTerms: ["currently unavailable"] },
      { fieldKey: "eur_withdrawal_fee", displayValue: "€2 + 2%", valueJson: { fixedAmount: 2, currency: "EUR", rate: 2, unit: "percent" }, scopeJson: { operation: "EUR withdrawal to card" }, requiredTerms: ["2 EUR + 2%"] },
      { fieldKey: "conversion_fee", displayValue: "0.5% crypto-to-EUR and crypto-to-crypto", valueJson: { rate: 0.5, unit: "percent" }, scopeJson: { operations: ["crypto-to-EUR", "crypto-to-crypto"] }, requiredTerms: ["Fixed fee", "Standard fee"] },
    ],
  },
  {
    candidateKey: "kraken-card",
    slug: "kraken-card-product",
    title: "Kraken Card",
    url: "https://www.kraken.com/features/crypto-card",
    authorityTier: "B",
    sourceType: "official issuer product and reward guide",
    facts: [
      { fieldKey: "reward_tier_light", displayValue: "Light: €200 rolling balance; 0.5% cashback", valueJson: { name: "Light", balanceThreshold: 200, balanceCurrency: "EUR", rate: 0.5, unit: "percent", tierOrder: 1 }, scopeJson: { dimension: "reward_tier", qualificationWindow: "30-day rolling average" }, requiredTerms: ["Light", "€200", "0.5%"] },
      { fieldKey: "reward_tier_pro", displayValue: "Pro: €1,000 rolling balance; 1% cashback", valueJson: { name: "Pro", balanceThreshold: 1000, balanceCurrency: "EUR", rate: 1, unit: "percent", tierOrder: 2 }, scopeJson: { dimension: "reward_tier", qualificationWindow: "30-day rolling average" }, requiredTerms: ["Pro", "€1,000", "1%"] },
      { fieldKey: "reward_tier_elite", displayValue: "Elite: €10,000 rolling balance; 1.5% cashback", valueJson: { name: "Elite", balanceThreshold: 10000, balanceCurrency: "EUR", rate: 1.5, unit: "percent", tierOrder: 3 }, scopeJson: { dimension: "reward_tier", qualificationWindow: "30-day rolling average" }, requiredTerms: ["Elite", "€10,000", "1.5%"] },
      { fieldKey: "reward_tier_max", displayValue: "Max: €50,000 rolling balance; 2% cashback", valueJson: { name: "Max", balanceThreshold: 50000, balanceCurrency: "EUR", rate: 2, unit: "percent", tierOrder: 4 }, scopeJson: { dimension: "reward_tier", qualificationWindow: "30-day rolling average" }, requiredTerms: ["Max", "€50,000", "2%"] },
      { fieldKey: "reward_qualification", displayValue: "Tier uses 30-day rolling average across Kraken, Kraken Pro, and Krak; new holders receive Max for 30 days", scopeJson: { temporaryIntroTier: true }, requiredTerms: ["30-day rolling average", "start at Max tier for 30 days"] },
      { fieldKey: "reward_currency", displayValue: "BTC or local currency", valueJson: { choices: ["BTC", "local currency"] }, scopeJson: { userChoice: true }, requiredTerms: ["cashback is paid in BTC or your local currency"] },
      { fieldKey: "annual_fee", displayValue: "Verified explicit zero monthly and annual fee", valueJson: { amount: 0 }, scopeJson: { orderFee: 0 }, requiredTerms: ["free to order", "no monthly or annual fees"] },
      { fieldKey: "benefit_travel", displayValue: "Travel offers include 4–6% cashback at checkout", valueJson: { minimumPercent: 4, maximumPercent: 6 }, scopeJson: { partnerTermsApply: true }, requiredTerms: ["Get up to 6% cashback on travel", "4–6% cashback at checkout"] },
    ],
  },
  {
    candidateKey: "kast-card",
    slug: "kast-card-plans",
    title: "KAST Crypto Cards",
    url: "https://www.kast.xyz/crypto-cards",
    authorityTier: "B",
    sourceType: "official issuer plan and benefit guide",
    facts: [
      { fieldKey: "card_plan_standard", displayValue: "Standard: 1.5% USD cashback", valueJson: { name: "Standard", rewardPercent: 1.5, rewardCurrency: "USD", tierOrder: 1 }, scopeJson: { dimension: "card_plan", currentProductPage: true }, requiredTerms: ["Standard Cards", "Cashback Rate", "1.5%"] },
      { fieldKey: "card_plan_premium", displayValue: "Premium: $1,000/year; 2% USD cashback", valueJson: { name: "Premium", annualFee: 1000, feeCurrency: "USD", rewardPercent: 2, rewardCurrency: "USD", tierOrder: 2 }, scopeJson: { dimension: "card_plan", currentProductPage: true }, requiredTerms: ["Premium Cards", "$1,000/year", "2%"] },
      { fieldKey: "card_plan_private", displayValue: "Private: $10,000/year; 3% USD cashback", valueJson: { name: "Private", annualFee: 10000, feeCurrency: "USD", rewardPercent: 3, rewardCurrency: "USD", tierOrder: 3 }, scopeJson: { dimension: "card_plan", currentProductPage: true }, requiredTerms: ["$10,000/year", "3%", "Get Private"] },
      { fieldKey: "mobile_wallet", displayValue: "Virtual card supports Apple Pay and Google Pay", scopeJson: { plan: "Standard and above" }, requiredTerms: ["Apple Pay", "Google pay"] },
      { fieldKey: "network", displayValue: "Visa", scopeJson: { merchantAcceptanceClaim: true }, requiredTerms: ["wherever Visa is accepted"] },
    ],
  },
  {
    candidateKey: "kast-card",
    slug: "kast-card-fees",
    title: "KAST Card and account fees",
    url: "https://concierge.kast.xyz/hc/en-us/articles/9850062738703-What-Are-the-Fees-and-Conditions-for-KAST-Cards-and-Accounts",
    authorityTier: "B",
    sourceType: "official issuer fee and limit guide",
    facts: [
      { fieldKey: "top_up_fee", displayValue: "Verified explicit zero", valueJson: { amount: 0 }, scopeJson: { plans: ["Standard", "Premium", "Limited", "Luxe"] }, requiredTerms: ["Top-up Fee", "0%"] },
      { fieldKey: "fx_fee", displayValue: "0.5–1.75% depending on residence and transaction country", valueJson: { minimumPercent: 0.5, maximumPercent: 1.75 }, scopeJson: { regional: true }, requiredTerms: ["0.5% - 1.75%", "country of residence"] },
      { fieldKey: "standard_physical_card", displayValue: "Free card plus $40 shipping", valueJson: { cardFee: 0, shippingFee: 40, currency: "USD" }, scopeJson: { plan: "Standard" }, requiredTerms: ["$40 shipping fee"] },
      { fieldKey: "virtual_card_limit", displayValue: "First two virtual cards free; later cards $2; some countries charge $2 for the first", valueJson: { freeCount: 2, additionalFee: 2, currency: "USD" }, scopeJson: { regionalException: true }, requiredTerms: ["First two virtual cards are free", "first virtual card costs $2"] },
    ],
  },
  {
    candidateKey: "bybit-card",
    slug: "bybit-card-rewards-2026",
    title: "Introduction to Bybit Card Rewards",
    url: "https://www.bybit.com/en/help-center/article/Introduction-to-Bybit-Card-Rewards",
    authorityTier: "B",
    sourceType: "official issuer reward and tier guide",
    facts: [
      { fieldKey: "reward_tier_base", displayValue: "Base: $0 spend; 2%; $5 monthly cap", valueJson: { name: "Base", spendThreshold: 0, rewardPercent: 2, monthlyPointCap: 2500, monthlyCashbackCap: 5, tierOrder: 1 }, scopeJson: { dimension: "reward_tier", nonVip: true }, requiredTerms: ["Tier 1 (Base)", "2.00%", "2,500"] },
      { fieldKey: "reward_tier_beta", displayValue: "Beta: VIP 1–2 or $500 spend; 2%; $50 monthly cap", valueJson: { name: "Beta", vipLevels: [1, 2], spendThreshold: 500, rewardPercent: 2, monthlyPointCap: 25000, monthlyCashbackCap: 50, tierOrder: 2 }, scopeJson: { dimension: "reward_tier" }, requiredTerms: ["Tier 2 (Beta)", "500", "25,000"] },
      { fieldKey: "reward_tier_alpha", displayValue: "Alpha: VIP 3 or $3,500 spend; 4%; $150 monthly cap", valueJson: { name: "Alpha", vipLevels: [3], spendThreshold: 3500, rewardPercent: 4, monthlyPointCap: 75000, monthlyCashbackCap: 150, tierOrder: 3 }, scopeJson: { dimension: "reward_tier" }, requiredTerms: ["Tier 3 (Alpha)", "3,500", "4.00%"] },
      { fieldKey: "reward_tier_apex", displayValue: "Apex: VIP 4/PRO 1 or $9,500 spend; 6%; $250 monthly cap", valueJson: { name: "Apex", vipLevels: [4], proLevels: [1], spendThreshold: 9500, rewardPercent: 6, monthlyPointCap: 125000, monthlyCashbackCap: 250, tierOrder: 4 }, scopeJson: { dimension: "reward_tier" }, requiredTerms: ["Tier 4 (Apex)", "9,500", "6.00%"] },
      { fieldKey: "reward_tier_omega", displayValue: "Omega: VIP 5/PRO 2 or $12,500 spend; 8%; $400 monthly cap", valueJson: { name: "Omega", vipLevels: [5], proLevels: [2], spendThreshold: 12500, rewardPercent: 8, monthlyPointCap: 200000, monthlyCashbackCap: 400, tierOrder: 5 }, scopeJson: { dimension: "reward_tier" }, requiredTerms: ["Tier 5 (Omega)", "12,500", "8.00%"] },
      { fieldKey: "reward_tier_infinite", displayValue: "Infinite: Supreme/PRO 3–5 or $25,000 spend; 10%; $600 monthly cap", valueJson: { name: "Infinite", vipLevels: ["Supreme"], proLevels: [3, 4, 5], spendThreshold: 25000, rewardPercent: 10, monthlyPointCap: 300000, monthlyCashbackCap: 600, tierOrder: 6 }, scopeJson: { dimension: "reward_tier" }, requiredTerms: ["Tier 6 (Infinite)", "25,000", "10.00%"] },
      { fieldKey: "reward_qualification", displayValue: "Spend-unlocked tier remains through the following calendar month; VIP supplies a minimum tier", scopeJson: { rolling: false, calendarMonth: true }, requiredTerms: ["end of the following calendar month", "will not drop below that tier"] },
      { fieldKey: "pay_later_benefit", displayValue: "Eligible installments add 1% from a separate capped bonus pool", valueJson: { additionalPercent: 1, separateCap: true }, scopeJson: { feature: "Pay Later", regionalAvailabilityRequiresReview: true }, requiredTerms: ["additional cashback", "separate bonus pool", "1%"] },
      { fieldKey: "reward_settlement", displayValue: "Points pend four calendar days; auto cashback pays USDT to Funding Account", scopeJson: { autoCashbackRequired: true }, requiredTerms: ["pending status for 4 calendar days", "Cashback (USDT)"] },
      { fieldKey: "benefit_ai_subscriptions", displayValue: "Eligible Tier 2+ official-site purchases can receive up to 100% back for ChatGPT Plus and Claude Pro", valueJson: { maximumPercent: 100, services: ["ChatGPT Plus", "Claude Pro"], minimumRewardTier: "Beta" }, scopeJson: { monthlyRewardCapApplies: true, eligiblePurchaseChannel: "official merchant site" }, requiredTerms: ["ChatGPT Plus", "Claude Pro", "100%"] },
      { fieldKey: "benefit_media_subscriptions", displayValue: "Eligible Tier 2+ official-site purchases can receive up to 100% back for Netflix, Spotify, TradingView, FT, Shahid, and iQIYI", valueJson: { maximumPercent: 100, services: ["Netflix", "Spotify", "TradingView", "Financial Times", "Shahid", "iQIYI"], minimumRewardTier: "Beta" }, scopeJson: { monthlyRewardCapApplies: true, eligiblePurchaseChannel: "official merchant site" }, requiredTerms: ["Netflix", "Spotify", "TradingView"] },
    ],
  },
];

export const priorityOfficialSources: OfficialSourceDefinition[] = [
  ...initialOfficialSources,
  ...catalogExpansionSources,
  ...legacyTierSources,
  ...remainingCatalogSources,
  ...finalCatalogSources,
];
