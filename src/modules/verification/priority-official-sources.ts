import type { Prisma } from "@/generated/prisma/client";

export type OfficialFact = {
  fieldKey: string;
  displayValue: string;
  valueJson?: Prisma.InputJsonValue;
  scopeJson: Prisma.InputJsonObject;
  requiredTerms: string[];
};

export type OfficialSourceDefinition = {
  candidateKey: "metamask-card" | "etherfi-card" | "gnosis-card";
  slug: string;
  title: string;
  url: string;
  authorityTier: "A" | "B";
  sourceType: string;
  facts: OfficialFact[];
};

export const priorityOfficialSources: OfficialSourceDefinition[] = [
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
      { fieldKey: "virtual_annual_fee", displayValue: "Verified explicit zero annual and maintenance fee", valueJson: { amount: 0, currency: "USD", period: "year" }, scopeJson: { plan: "Virtual" }, requiredTerms: ["Virtual card has no annual fees", "maintenance fees"] },
      { fieldKey: "metal_annual_fee", displayValue: "$199 per year", valueJson: { amount: 199, currency: "USD", period: "year" }, scopeJson: { plan: "Metal", country: "US", availability: "orders paused 2026-06-02" }, requiredTerms: ["Metal card has an annual fee of $199", "temporarily paused"] },
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
      { fieldKey: "spend_limit", displayValue: "Core $30k/day; Luxe $50k/day; Pinnacle $100k/day", valueJson: { Core: 30000, Luxe: 50000, Pinnacle: 100000, currency: "USD", period: "day" }, scopeJson: { product: "personal Cash" }, requiredTerms: ["$30k/day", "$50k/day", "$100k/day"] },
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
];
