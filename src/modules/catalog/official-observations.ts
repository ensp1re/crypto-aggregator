import { priorityOfficialSources } from "@/modules/verification/priority-official-sources";

const fieldLabels: Record<string, string> = {
  atm_fee: "ATM fee and allowance",
  card_type: "Card model",
  eligibility_scope: "Eligibility scope",
  funding_model: "Funding control",
  fx_fee: "Foreign exchange fee",
  issuance_fee: "Card issuance fee",
  issuer_relationship: "Issuer relationship",
  kyc: "Identity verification",
  metal_annual_fee: "Metal annual fee",
  provider_relationship: "Provider relationship",
  reward_rate: "Reward rate",
  signup_status: "Signup status",
  spend_limit: "Spending limit",
  virtual_annual_fee: "Virtual annual fee",
};

function words(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());
}

function scopeValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(scopeValue).join(", ");
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (value && typeof value === "object") return Object.entries(value).map(([key, nested]) => `${words(key)} ${scopeValue(nested)}`).join(", ");
  return String(value);
}

export function getOfficialObservations(candidateKey: string) {
  return priorityOfficialSources
    .filter((source) => source.candidateKey === candidateKey)
    .flatMap((source) => source.facts.map((fact) => ({
      key: `${source.slug}:${fact.fieldKey}`,
      label: fieldLabels[fact.fieldKey] ?? words(fact.fieldKey),
      value: fact.displayValue,
      scope: Object.entries(fact.scopeJson).map(([key, value]) => `${words(key)}: ${scopeValue(value)}`).join("; "),
      sourceTitle: source.title,
      sourceUrl: source.url,
      authorityTier: source.authorityTier,
    })));
}
