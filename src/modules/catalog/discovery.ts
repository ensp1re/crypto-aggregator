import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { officialIssuerMedia, type OfficialIssuerMedia } from "./official-media";
import { unavailable, type BenefitKind, type CardFactKey, type ProgramBenefit } from "./program-details";
export { unavailable } from "./program-details";

export type CatalogObservation = {
  key: string;
  label: string;
  value: string;
  scope: string;
  sourceUrl: string;
  observedAt: string;
};

export type DiscoveryPlanOption = {
  id: string;
  name: string;
  summary: string;
  tierOrder: number;
  qualification?: string;
  lifecycle?: string;
  facts: Partial<Record<CardFactKey, string>>;
  benefits: ProgramBenefit[];
};

export type DiscoveryPlanDimension = {
  id: string;
  label: string;
  kind: string;
  combinable: boolean;
  options: DiscoveryPlanOption[];
};

export type DiscoveryCard = {
  id: string;
  slug: string;
  name: string;
  issuer: string;
  officialLink?: string;
  logo?: string;
  media?: OfficialIssuerMedia;
  verification: "official-research" | "blocked";
  planResearchStatus: "STRUCTURED" | "PARTIAL" | "NO_PUBLIC_MATRIX" | "BLOCKED";
  planResearchReason?: string;
  regions: string;
  kyc: string;
  custody: string;
  type: string;
  network: string;
  supportedAssets: string;
  fundingFee: string;
  annualFee: string;
  fxFee: string;
  atmLimit: string;
  cashbackMax: string;
  stakingRequired: string;
  supportedCurrencies: string[];
  mobilePay: boolean;
  metal: boolean;
  facts: Partial<Record<CardFactKey, string>>;
  factSources: Partial<Record<CardFactKey, "official" | "catalog-lead">>;
  dimensions: DiscoveryPlanDimension[];
  benefits: ProgramBenefit[];
  observations: CatalogObservation[];
};

export type CatalogQuery = {
  query?: string;
  custody?: string;
  network?: string;
};

const factPreferences: Record<CardFactKey, string[]> = {
  regions: ["eligibility_scope", "eligibility", "regional_scope"],
  kyc: ["kyc"],
  custody: ["funding_model"],
  type: ["card_type", "card_forms", "card_form"],
  network: ["network", "network_issuer"],
  supportedAssets: ["supported_assets", "currencies_assets", "funding_asset"],
  fundingFee: ["top_up_fee", "topup_fee", "load_fee"],
  annualFee: ["annual_fee"],
  fxFee: ["fx_fee", "fx"],
  atmLimit: ["atm_limit", "atm_limits", "atm_fee", "atm", "atm_availability"],
  cashbackMax: ["reward_rate", "reward_current", "reward_default", "reward", "purchase_fee_reward"],
  stakingRequired: ["reward_qualification", "qualification_paths", "staking_requirement"],
};

const observationLabels: Record<string, string> = {
  annual_fee: "Annual fee",
  atm: "ATM fees and limits",
  atm_availability: "ATM availability",
  atm_fee: "ATM fees and limits",
  benefit_ai_subscriptions: "AI subscriptions",
  benefit_media_subscriptions: "Media subscriptions",
  card_type: "Card model",
  conversion_fee: "Conversion fee",
  eligibility: "Eligibility",
  eligibility_scope: "Eligibility",
  funding_model: "Funding model",
  fx: "FX fee",
  fx_fee: "FX fee",
  issuance_fee: "Issuance fee",
  kyc: "KYC",
  mobile_wallet: "Mobile wallets",
  network: "Payment network",
  reward_currency: "Reward currency",
  reward_qualification: "Reward qualification",
  reward_rate: "Rewards",
  spend_limit: "Spending limit",
  supported_assets: "Supported assets",
  top_up_fee: "Top-up fee",
};

function asObject(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function canonicalSlug(externalKey: string) {
  if (externalKey === "ready-lite") return "ready-card";
  if (externalKey === "Kripicard") return "kripicard";
  return externalKey.toLowerCase();
}

function canonicalName(externalKey: string, hint: string) {
  if (externalKey === "ready-lite") return "Ready Card";
  if (externalKey === "Kripicard") return "Kripicard";
  return hint;
}

function canonicalOfficialLink(externalKey: string, candidateUrl: string | null) {
  if (externalKey === "ready-lite") return "https://www.ready.co/card";
  return candidateUrl ?? undefined;
}

function humanize(value: string) {
  const known: Record<string, string> = {
    benefit_ai_subscriptions: "AI subscription rebate",
    benefit_media_subscriptions: "Streaming subscription rebate",
    future_subscription_benefit: "Subscription rebate",
    mobile_wallet: "Mobile wallet support",
  };
  if (known[value]) return known[value];
  return value.replace(/^(benefit|promotion|future)_/, "").replace(/_(benefit|promotion)$/, "").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()).replace(/\bAi\b/g, "AI").replace(/\bFx\b/g, "FX").replace(/\bAtm\b/g, "ATM");
}

function visibleValue(value: string) {
  return value.replace(/[—–]/g, "-");
}

function numberValue(value: Record<string, unknown>, key: string) {
  return typeof value[key] === "number" ? value[key] as number : undefined;
}

function money(amount: number, currency = "USD") {
  const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function structuredFact(entry: { fieldKey: string; displayValue: string; valueJson?: unknown }, key: CardFactKey) {
  const value = asObject(entry.valueJson);
  if (!value) return undefined;
  const feeCurrency = typeof value.feeCurrency === "string" ? value.feeCurrency : "USD";

  if (key === "annualFee") {
    const annual = numberValue(value, "annualFee") ?? numberValue(value, "annualFeeUsd");
    const monthly = numberValue(value, "monthlyFee") ?? numberValue(value, "monthlyFeeUsd");
    if (annual !== undefined) return annual === 0 ? "Free" : `${money(annual, feeCurrency)}/year`;
    if (monthly !== undefined) return monthly === 0 ? "No monthly fee" : `${money(monthly, feeCurrency)}/month`;
  }
  if (key === "fxFee") {
    const percent = numberValue(value, "fxFeePercent") ?? numberValue(value, "fxPercent") ?? numberValue(value, "issuerMarkupPercent");
    if (percent !== undefined) return percent === 0 ? "No issuer FX fee" : `${percent}%`;
  }
  if (key === "atmLimit") {
    const freeMonthly = numberValue(value, "monthlyFreeAtmUsd") ?? numberValue(value, "monthlyAtmWaiverUsd");
    const daily = numberValue(value, "dailyLimitUsd") ?? numberValue(value, "dailyLimit");
    const fee = numberValue(value, "atmFeePercent") ?? numberValue(value, "feeAfterPercent");
    if (freeMonthly !== undefined) return `${money(freeMonthly)}/month without issuer ATM fees${fee ? `, then ${fee}%` : ""}`;
    if (daily !== undefined) return `${money(daily)}/day${fee !== undefined ? `, ${fee}% fee` : ""}`;
    if (fee !== undefined) return fee === 0 ? "No issuer ATM fee" : `${fee}% issuer ATM fee`;
  }
  if (key === "cashbackMax") {
    if (entry.fieldKey.includes("reward")) return entry.displayValue;
    const percent = numberValue(value, "rewardPercent") ?? numberValue(value, "rate") ?? numberValue(value, "nexoPercent") ?? numberValue(value, "btcPercent");
    const points = numberValue(value, "pointsPerUsd");
    if (percent !== undefined) return `${percent}%${typeof value.rewardCurrency === "string" ? ` in ${value.rewardCurrency}` : " rewards"}`;
    if (points !== undefined) return `${points} points per USD`;
  }
  if (key === "type") {
    const forms = Array.isArray(value.forms) ? value.forms.filter((item): item is string => typeof item === "string") : [];
    if (forms.length) return forms.join(" and ");
    if (typeof value.form === "string") return value.form;
    if (typeof value.networkTier === "string") return value.networkTier;
  }
  if (key === "fundingFee") {
    const percent = numberValue(value, "loadPercent") ?? numberValue(value, "topUpPercent") ?? numberValue(value, "topupPercent");
    if (percent !== undefined) return percent === 0 ? "No card load fee" : `${percent}% card load fee`;
  }
  return undefined;
}

function scopeText(scope: unknown) {
  const object = asObject(scope);
  if (!object) return "Applies to the card program";
  if (typeof object.plan === "string") return `${object.plan} plan`;
  if (typeof object.tier === "string") return `${object.tier} tier`;
  if (typeof object.country === "string") return `${object.country} offering`;
  if (typeof object.region === "string") return `${object.region} offering`;
  if (Array.isArray(object.regions)) return `${object.regions.join(", ")} residents`;
  return "Applies to the card program";
}

function factsFromEntries(entries: Array<{ fieldKey: string; displayValue: string; valueJson?: unknown }>) {
  const byKey = new Map(entries.map((entry) => [entry.fieldKey, entry.displayValue]));
  const facts = Object.fromEntries(Object.entries(factPreferences).flatMap(([factKey, keys]) => {
    const match = keys.find((key) => byKey.has(key));
    return match ? [[factKey, byKey.get(match) as string]] : [];
  })) as Partial<Record<CardFactKey, string>>;
  for (const entry of entries) {
    for (const key of Object.keys(factPreferences) as CardFactKey[]) {
      const value = facts[key] ? undefined : structuredFact(entry, key);
      if (value) facts[key] = value;
    }
  }
  return facts;
}

function catalogLeadFacts(observation: unknown) {
  const lead = asObject(observation);
  if (!lead) return {};
  const string = (key: string) => typeof lead[key] === "string" && lead[key] ? visibleValue(lead[key] as string).replace(/^NA$|^Not specified$/i, unavailable) : undefined;
  const reward = typeof lead.cashbackMax === "number" ? (lead.cashbackMax > 0 ? `Up to ${lead.cashbackMax}%` : "No reward rate listed") : undefined;
  return {
    regions: string("regions"),
    kyc: string("kyc"),
    custody: string("custody"),
    type: string("type"),
    network: string("network"),
    supportedAssets: string("supportedAssets"),
    annualFee: string("annualFee"),
    fxFee: string("fxFee"),
    atmLimit: string("atmLimit"),
    cashbackMax: reward,
    stakingRequired: string("stakingRequired"),
  } satisfies Partial<Record<CardFactKey, string | undefined>>;
}

function fallbackLogo(observation: unknown, officialUrl: string | null) {
  const lead = asObject(observation);
  if (typeof lead?.logo === "string") return lead.logo;
  if (!officialUrl) return undefined;
  try { return `https://unavatar.io/${new URL(officialUrl).hostname}`; } catch { return undefined; }
}

function benefitKind(fieldKey: string): BenefitKind {
  if (fieldKey.includes("travel") || fieldKey.includes("lounge") || fieldKey.includes("hotel")) return "travel";
  if (fieldKey.includes("subscription") || fieldKey.includes("media") || fieldKey.includes("_ai_")) return "subscriptions";
  if (fieldKey.includes("wallet")) return "wallet";
  if (fieldKey.includes("reward") || fieldKey.includes("cashback")) return "rewards";
  return "partner";
}

function benefitsFromEntries(entries: Array<{ fieldKey: string; displayValue: string; scopeJson?: unknown; valueJson?: unknown }>) {
  return entries.filter(({ fieldKey }) => fieldKey.includes("benefit") || fieldKey.includes("promotion") || fieldKey.includes("partner_perk") || fieldKey === "mobile_wallet")
    .map(({ fieldKey, displayValue, scopeJson }) => {
      const scope = asObject(scopeJson);
      const endDate = typeof scope?.endDate === "string" ? scope.endDate : undefined;
      const future = scope?.lifecycle === "ANNOUNCED" || scope?.publishAsCurrent === false;
      const temporary = scope?.temporaryProgramme === true || scope?.timeLimited === true || Boolean(endDate);
      return {
        kind: benefitKind(fieldKey),
        title: humanize(fieldKey),
        description: displayValue,
        status: future ? "coming-soon" : temporary ? "time-limited" : undefined,
        validUntil: endDate,
      } satisfies ProgramBenefit;
    });
}

function optionObservations(valueJson: unknown) {
  const observations = asArray(asObject(valueJson)?.observations);
  return observations.flatMap((item) => {
    const object = asObject(item);
    return typeof object?.fieldKey === "string" && typeof object.displayValue === "string"
      ? [{ fieldKey: object.fieldKey, displayValue: visibleValue(object.displayValue), scopeJson: object.scope, valueJson: object.value }]
      : [];
  });
}

export const getDiscoverySnapshot = cache(async function getDiscoverySnapshot() {
  const candidates = await prisma.discoveryCandidate.findMany({
    orderBy: { canonicalHint: "asc" },
    include: {
      evidence: {
        orderBy: { observedAt: "desc" },
        include: { artifact: { include: { source: true } } },
      },
      planDimensions: {
        orderBy: { displayOrder: "asc" },
        include: { options: { orderBy: { tierOrder: "asc" } } },
      },
    },
  });

  const cards: DiscoveryCard[] = candidates.map((candidate) => {
    const latestEvidence = new Map<string, (typeof candidate.evidence)[number]>();
    for (const evidence of candidate.evidence) {
      if (!latestEvidence.has(evidence.fieldKey)) latestEvidence.set(evidence.fieldKey, evidence);
    }
    const currentEvidence = [...latestEvidence.values()];
    const catalogLead = asObject(candidate.observation);
    const evidenceEntries = currentEvidence.map(({ fieldKey, displayValue, scopeJson, valueJson }) => ({ fieldKey, displayValue: visibleValue(displayValue), scopeJson, valueJson }));
    const programEntries = evidenceEntries.filter((entry) => {
      const scope = asObject(entry.scopeJson);
      return !scope?.plan && !scope?.tier && !scope?.dimension;
    });
    const officialFacts = factsFromEntries(programEntries);
    const leadFacts = catalogLeadFacts(candidate.observation);
    const facts = { ...leadFacts, ...officialFacts } as Partial<Record<CardFactKey, string>>;
    const factSources = Object.fromEntries((Object.keys(facts) as CardFactKey[]).map((key) => [key, officialFacts[key] ? "official" : "catalog-lead"])) as DiscoveryCard["factSources"];
    const media = officialIssuerMedia[candidate.externalKey];
    const dimensions = candidate.planDimensions.map((dimension) => ({
      id: dimension.slug,
      label: dimension.label,
      kind: dimension.kind,
      combinable: dimension.combinable,
      options: dimension.options.map((option) => {
        const entries = optionObservations(option.valueJson);
        return {
          id: option.slug,
          name: option.name,
          summary: visibleValue(option.displayValue),
          tierOrder: option.tierOrder,
          qualification: option.qualification ?? undefined,
          lifecycle: option.lifecycle ?? undefined,
          facts: factsFromEntries(entries),
          benefits: benefitsFromEntries(entries),
        };
      }),
    })).filter(({ options }) => options.length > 0);
    const values = (key: CardFactKey) => facts[key] ?? unavailable;
    const observations = currentEvidence.map((evidence) => ({
      key: evidence.fieldKey,
      label: observationLabels[evidence.fieldKey] ?? humanize(evidence.fieldKey),
      value: visibleValue(evidence.displayValue),
      scope: scopeText(evidence.scopeJson),
      sourceUrl: evidence.artifact.locator,
      observedAt: evidence.observedAt.toISOString(),
    }));
    const officialCurrencies = asArray(asObject(currentEvidence.find(({ fieldKey }) => fieldKey === "supported_assets")?.valueJson)?.assets)
      .filter((value): value is string => typeof value === "string");
    const catalogCurrencies = asArray(catalogLead?.supportedCurrencies).filter((value): value is string => typeof value === "string");

    return {
      id: candidate.externalKey,
      slug: canonicalSlug(candidate.externalKey),
      name: canonicalName(candidate.externalKey, candidate.canonicalHint),
      issuer: candidate.issuerHint,
      officialLink: canonicalOfficialLink(candidate.externalKey, candidate.officialUrl),
      logo: media?.path ?? fallbackLogo(candidate.observation, candidate.officialUrl),
      media,
      verification: candidate.planResearchStatus === "BLOCKED" ? "blocked" : "official-research",
      planResearchStatus: candidate.planResearchStatus,
      planResearchReason: candidate.planResearchReason ?? undefined,
      regions: values("regions"),
      kyc: values("kyc"),
      custody: values("custody"),
      type: values("type"),
      network: values("network"),
      supportedAssets: values("supportedAssets"),
      fundingFee: values("fundingFee"),
      annualFee: values("annualFee"),
      fxFee: values("fxFee"),
      atmLimit: values("atmLimit"),
      cashbackMax: values("cashbackMax"),
      stakingRequired: values("stakingRequired"),
      supportedCurrencies: officialCurrencies.length ? officialCurrencies : catalogCurrencies,
      mobilePay: currentEvidence.some(({ fieldKey }) => fieldKey === "mobile_wallet") || catalogLead?.mobilePay === true,
      metal: dimensions.some(({ options }) => options.some(({ name }) => name.toLowerCase().includes("metal"))) || catalogLead?.metal === true,
      facts,
      factSources,
      dimensions,
      benefits: benefitsFromEntries(evidenceEntries.filter(({ scopeJson, valueJson }) => !asObject(scopeJson)?.plan && !asObject(scopeJson)?.tier && !asObject(valueJson)?.minimumRewardTier)),
      observations,
    };
  });

  return { cards, observedAt: cards.flatMap(({ observations }) => observations.map(({ observedAt }) => observedAt)).sort().at(-1) };
});

export async function getDiscoveryCard(slug: string) {
  const { cards } = await getDiscoverySnapshot();
  return cards.find((card) => card.slug === slug.toLowerCase());
}

export function filterDiscoveryCards(cards: DiscoveryCard[], { query = "", custody = "all", network = "all" }: CatalogQuery) {
  const normalizedQuery = query.trim().toLowerCase();
  return cards.filter((card) => {
    const matchesQuery = !normalizedQuery || [card.name, card.issuer, card.regions, card.supportedAssets]
      .some((value) => value.toLowerCase().includes(normalizedQuery));
    const matchesCustody = custody === "all" || card.custody === custody;
    const matchesNetwork = network === "all" || category(card.network, "network") === network;
    return matchesQuery && matchesCustody && matchesNetwork;
  });
}

export function distribution(cards: DiscoveryCard[], field: "custody" | "network" | "type") {
  const counts = new Map<string, number>();
  for (const card of cards) {
    const label = category(card[field], field);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

function category(value: string, field: "custody" | "network" | "type") {
  if (value === unavailable) return unavailable;
  const normalized = value.toLowerCase();
  if (field === "network") {
    const visa = normalized.includes("visa");
    const mastercard = normalized.includes("mastercard");
    if (visa && mastercard) return "Visa / Mastercard";
    if (visa) return "Visa";
    if (mastercard) return "Mastercard";
    return "Other network";
  }
  if (field === "custody") {
    if (/self[- ]?custod|non[- ]?custod|delegated wallet/.test(normalized)) return "Self-custody";
    if (/credit|collateral|borrow/.test(normalized)) return "Credit or collateral";
    if (/custod|account balance|fiat account|preload|pre-load/.test(normalized)) return "Custodial account";
    if (/convert|wallet|spend.*crypto/.test(normalized)) return "Wallet conversion";
    return "Other funding model";
  }
  if (normalized.includes("credit")) return "Credit";
  if (normalized.includes("prepaid")) return "Prepaid";
  if (normalized.includes("debit")) return "Debit";
  if (normalized.includes("virtual") && !normalized.includes("physical")) return "Virtual only";
  return "Other card model";
}

export function maximumReward(card: DiscoveryCard) {
  return card.cashbackMax;
}
