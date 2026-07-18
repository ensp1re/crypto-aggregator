import type { OfficialSourceDefinition } from "./priority-official-sources";

/** Last reachable official sources from the original 60-candidate inventory. */
export const finalCatalogSources: OfficialSourceDefinition[] = [
  {
    candidateKey: "avici-card",
    slug: "avici-card-fees-limits-2026",
    title: "Avici business card fees and limits",
    url: "https://docs.avici.money/getting-started/business-cards/fees-and-limits",
    authorityTier: "B",
    sourceType: "official card fee and limit guide",
    facts: [
      { fieldKey: "card_forms", displayValue: "Four virtual cards are free for new customers, then $10 each; a physical card costs $50", valueJson: { freeVirtualCards: 4, additionalVirtualCardUsd: 10, physicalCardUsd: 50 }, scopeJson: { product: "business card", deliveryChargesSeparate: true }, requiredTerms: ["4 free cards", "$10 one-time fee", "$50 basic card fee"] },
      { fieldKey: "card_fees", displayValue: "Avici charges no transaction, top-up, wallet-withdrawal, low-authorization, or declined-payment fee", valueJson: { transactionFeeUsd: 0, topupFeeUsd: 0, walletWithdrawalFeeUsd: 0 }, scopeJson: { atmDeclinesExcluded: true }, requiredTerms: ["Transaction fees", "$0", "no top-up or withdrawal to wallet fees"] },
      { fieldKey: "fx", displayValue: "No Avici FX markup; Visa may charge 0.4% to 1% cross-border on non-USD transactions", valueJson: { issuerMarkupPercent: 0, visaCrossBorderPercentRange: [0.4, 1] }, scopeJson: { nonUsd: true, networkFeeMayApply: true }, requiredTerms: ["Forex markups", "0%", "Visa may charge", "0.4-1%"] },
      { fieldKey: "atm", displayValue: "Business-card ATM limit is $250 daily, three transactions daily, with no Avici withdrawal fee", valueJson: { dailyLimitUsd: 250, dailyTransactions: 3, issuerWithdrawalFeeUsd: 0 }, scopeJson: { product: "business card", atmOperatorFeeNotAsserted: true }, requiredTerms: ["$250 per day", "ATM Withdrawal Fees", "Transactions per day"] },
    ],
  },
  {
    candidateKey: "savepay-card",
    slug: "savepay-card-2026",
    title: "SavePay Swiss crypto debit card",
    url: "https://savepay.gitbook.io/savepay/product/quickstart",
    authorityTier: "B",
    sourceType: "official wallet co-brand product page",
    facts: [
      { fieldKey: "provider_relationship", displayValue: "SavePay supplies the interface and Fiat24 provides the prepaid debit card", valueJson: { interface: "SavePay", provider: "Fiat24" }, scopeJson: { coBrand: true, canonicalProviderRelationshipRequired: true }, requiredTerms: ["provided by Fiat24"] },
      { fieldKey: "card_type", displayValue: "Visa or Mastercard prepaid debit card using the SavePay stablecoin balance", valueJson: { networks: ["Visa", "Mastercard"], type: "prepaid debit" }, scopeJson: { exactNetworkDependsOnIssuance: true, stablecoinBalance: true }, requiredTerms: ["Visa", "Mastercard", "prepaid debit card", "stablecoin balance"] },
      { fieldKey: "account_fees", displayValue: "Swiss bank account and virtual card are advertised without management fees", valueJson: { managementFee: 0, virtualCardFee: 0 }, scopeJson: { providerTermsAndOtherFeesMayApply: true }, requiredTerms: ["Swiss bank account for free", "no management fees", "free virtual"] },
      { fieldKey: "mobile_wallet", displayValue: "Google Pay, Apple Pay, and Samsung Pay", valueJson: { wallets: ["Google Pay", "Apple Pay", "Samsung Pay"] }, scopeJson: { regionalAvailabilityMayVary: true }, requiredTerms: ["Google Pay", "Apple Pay", "Samsung Pay"] },
    ],
  },
  {
    candidateKey: "ur-card",
    slug: "ur-product-2026",
    title: "UR financial infrastructure",
    url: "https://ur.app/",
    authorityTier: "B",
    sourceType: "official account and card product page",
    facts: [
      { fieldKey: "provider_identity", displayValue: "UR is the SR Saphirstein AG platform, not an independent card issuer brand", valueJson: { product: "UR", legalEntity: "SR Saphirstein AG" }, scopeJson: { canonicalProviderRelationshipRequired: true }, requiredTerms: ["UR is the trademark of SR Saphirstein AG"] },
      { fieldKey: "account_card", displayValue: "Swiss IBAN, seven currencies, and Mastercard within a multicurrency account", valueJson: { network: "Mastercard", statedCurrencyCount: 7 }, scopeJson: { accountProduct: true, exactCardFeesNotPublishedOnPage: true }, requiredTerms: ["Swiss IBAN", "7 currencies", "Mastercard", "Multicurrency everyday accounts"] },
      { fieldKey: "kyc", displayValue: "KYC and AML controls are built in", scopeJson: { verificationRequired: true }, requiredTerms: ["KYC and AML controls"] },
      { fieldKey: "funding_model", displayValue: "Instant conversion between digital currencies and cash", scopeJson: { automaticOrManualExactFlowNotAsserted: true }, requiredTerms: ["Instant conversions between digital currencies and cash"] },
    ],
  },
  {
    candidateKey: "zypto-card",
    slug: "zypto-premium-cards-2026",
    title: "Zypto Premium Visa Card FAQ",
    url: "https://help.zypto.com/en/articles/9630445-premium-visa-card-faq",
    authorityTier: "B",
    sourceType: "official card-plan, fee, limit, and benefit guide",
    facts: [
      { fieldKey: "program_identity", displayValue: "Zypto Premium Visa is available in virtual and physical forms, not separate catalog programs", valueJson: { plan: "Premium", forms: ["virtual", "physical"] }, scopeJson: { dimension: "card_plan", separateCatalogCards: false }, requiredTerms: ["Premium virtual and physical cards"] },
      { fieldKey: "fees", displayValue: "Virtual creation and activation are free; no monthly fee; $0.30 per transaction, 3% load, and 1.75% FX", valueJson: { virtualCreationFeeUsd: 0, activationFeeUsd: 0, monthlyFeeUsd: 0, transactionFeeUsd: 0.3, loadPercent: 3, fxPercent: 1.75 }, scopeJson: { plan: "Premium", physicalShippingVaries: true, feesSubjectToChange: true }, requiredTerms: ["Virtual card creation", "Free", "Per-transaction fee", "$0.30", "Card load fee", "3%", "1.75%"] },
      { fieldKey: "kyc", displayValue: "KYC is required before issuance", scopeJson: { verificationRequired: true }, requiredTerms: ["After KYC approval"] },
      { fieldKey: "mobile_wallet", displayValue: "Apple Pay, Google Pay, Samsung Pay, and other supported mobile wallets", valueJson: { wallets: ["Apple Pay", "Google Pay", "Samsung Pay"] }, scopeJson: { plan: "Premium", exactAvailabilityMayVary: true }, requiredTerms: ["Apple Pay", "Google Pay", "Samsung Pay"] },
    ],
  },
];

export const finalCatalogCandidateKeys = [...new Set(finalCatalogSources.map(({ candidateKey }) => candidateKey))];

export const officialCatalogResearchBlockers = [
  {
    candidateKey: "binance-card",
    officialUrl: "https://www.binance.com/pt-BR",
    reason: "Binance's indexed Brazil page describes a current Mastercard, but the controlled fetch returns geo-personalized content without the card terms; former EEA terms are stale and must not be substituted.",
  },
  {
    candidateKey: "bitpay-card",
    officialUrl: "https://bitpay.com/assets/pdfs/mc-cardholder-agreement.pdf",
    reason: "Official cardholder agreement is PDF-only and no current public application/product page was verifiable; current availability and economics remain unconfirmed.",
  },
  {
    candidateKey: "coinbase-card",
    officialUrl: "https://www.coinbase.com/en-gb/legal/creditcard/rewards",
    reason: "Official pages verify separate debit and Coinbase One credit products plus a four-tier BTC matrix, but Coinbase returns HTTP 403 to the controlled collector; the products must not be merged from cached text.",
  },
  {
    candidateKey: "deblock-card",
    officialUrl: "https://cdn1.deblock.com/terms/fee_info/Fees_Pages_Deblock_PT_v6.3.pdf",
    reason: "Current July 2026 Standard/Premium/Native fee matrix is PDF-only; the controlled collector accepts auditable HTML or JSON and has not ingested the PDF.",
  },
  {
    candidateKey: "Kripicard",
    officialUrl: "https://home.kripicard.com/fees",
    reason: "The indexed official pricing page exposes Premium fees and limits, but its controlled HTML response is an empty client-rendered shell; cached values cannot be promoted as current evidence.",
  },
  {
    candidateKey: "tapx-card",
    officialUrl: "https://tapxcard.com/",
    reason: "The catalog official domain timed out and no current official documentation could be verified; legacy snapshot claims must not be published.",
  },
  {
    candidateKey: "revolut-crypto-card",
    officialUrl: "https://www.revolut.com/crypto/crypto-card/",
    reason: "Official UK pages verify a crypto-Pocket-linked debit card and plan-sensitive fair-usage fees, but return HTTP 403 to the controlled collector; regional cached text is not persisted as evidence.",
  },
  {
    candidateKey: "xapo-card",
    officialUrl: "https://legal.xapobank.com/fees/fees",
    reason: "Current official terms verify a $1,000 annual account bundle, metal debit card, ATM allowance, and lounge benefit, but both legal and FAQ sites return HTTP 403 to controlled collection.",
  },
] as const;
