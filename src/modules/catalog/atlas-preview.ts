import type { AtlasProgramView, PublishedClaimView } from "./catalog-types";

const observedAt = new Date("2026-07-12T10:00:00.000Z");
const publishedAt = new Date("2026-07-14T09:00:00.000Z");

function claim(
  countryCode: "DE" | "FR",
  planId: string | null,
  field: string,
  displayValue: string,
  valueState: PublishedClaimView["valueState"] = "KNOWN",
): PublishedClaimView {
  const country = countryCode === "DE" ? "Germany" : "France";
  return {
    planId,
    field,
    valueState,
    displayValue,
    observedAt,
    publishedAt,
    claim: {
      evidence: [{
        artifact: {
          locator: "Synthetic terms list",
          rightsStatus: "license-safe fixture",
          source: {
            title: `Atlas ${country} synthetic terms`,
            authorityTier: "A",
            sourceType: "synthetic official terms",
          },
        },
      }],
    },
  };
}

const deClaims = [
  claim("DE", null, "ELIGIBILITY", "Eligible for residents of Germany aged 18+"),
  claim("DE", null, "CARD_TYPE", "Prepaid Visa"),
  claim("DE", null, "FUNDING_MODEL", "Crypto converts to EUR before authorization"),
  claim("DE", null, "FX_FEE", "1%"),
  claim("DE", null, "ATM_FEE", "2% after EUR 200/month"),
  claim("DE", null, "SPEND_LIMIT", "EUR 20,000/month"),
  claim("DE", "atlas-de-core", "MONTHLY_FEE", "Verified explicit zero"),
  claim("DE", "atlas-de-core", "REWARD_RATE", "0.5%"),
  claim("DE", "atlas-de-core", "REWARD_CAP", "EUR 10/month"),
  claim("DE", "atlas-de-plus", "MONTHLY_FEE", "EUR 9.99/month"),
  claim("DE", "atlas-de-plus", "REWARD_RATE", "2%"),
  claim("DE", "atlas-de-plus", "REWARD_CAP", "EUR 50/month"),
];

const frClaims = [
  claim("FR", null, "ELIGIBILITY", "Eligible for residents of France aged 18+"),
  claim("FR", null, "CARD_TYPE", "Debit Mastercard"),
  claim("FR", null, "FUNDING_MODEL", "Prefunded EUR account"),
  claim("FR", null, "FX_FEE", "0.8%"),
  claim("FR", null, "ATM_FEE", "Issuer did not disclose", "NOT_DISCLOSED"),
  claim("FR", null, "SPEND_LIMIT", "EUR 15,000/month"),
  claim("FR", "atlas-fr-core", "MONTHLY_FEE", "Verified explicit zero"),
  claim("FR", "atlas-fr-core", "REWARD_RATE", "0.75%"),
  claim("FR", "atlas-fr-core", "REWARD_CAP", "EUR 12/month"),
  claim("FR", "atlas-fr-plus", "MONTHLY_FEE", "EUR 7.99/month"),
  claim("FR", "atlas-fr-plus", "REWARD_RATE", "1.5%"),
  claim("FR", "atlas-fr-plus", "REWARD_CAP", "EUR 40/month"),
];

export const atlasPreview: AtlasProgramView = {
  name: "Atlas Card",
  offerings: [
    {
      id: "atlas-card-de",
      slug: "atlas-card-de",
      label: "Germany offering",
      countryCode: "DE",
      lifecycle: "LIVE",
      network: "Visa",
      cardType: "Prepaid",
      settlementModel: "Prefunded EUR balance",
      issuer: { name: "Example EU Payments GmbH" },
      plans: [
        { id: "atlas-de-core", name: "Core", tierOrder: 1, qualification: "No subscription" },
        { id: "atlas-de-plus", name: "Plus", tierOrder: 2, qualification: "EUR 9.99 monthly subscription" },
      ],
      publishedClaims: deClaims,
    },
    {
      id: "atlas-card-fr",
      slug: "atlas-card-fr",
      label: "France offering",
      countryCode: "FR",
      lifecycle: "LIVE",
      network: "Mastercard",
      cardType: "Debit",
      settlementModel: "Direct EUR authorization",
      issuer: { name: "Example France Payments SAS" },
      plans: [
        { id: "atlas-fr-core", name: "Core", tierOrder: 1, qualification: "No subscription" },
        { id: "atlas-fr-plus", name: "Plus", tierOrder: 2, qualification: "EUR 7.99 monthly subscription" },
      ],
      publishedClaims: frClaims,
    },
  ],
};
