import type { DiscoveryCard, DiscoveryPlanDimension, DiscoveryPlanOption } from "./discovery";

export type CardFactKey =
  | "regions"
  | "kyc"
  | "custody"
  | "type"
  | "network"
  | "supportedAssets"
  | "fundingFee"
  | "annualFee"
  | "fxFee"
  | "atmLimit"
  | "cashbackMax"
  | "stakingRequired";

export type BenefitKind = "rewards" | "travel" | "subscriptions" | "partner" | "wallet";

export type ProgramBenefit = {
  kind: BenefitKind;
  title: string;
  description: string;
  status?: "coming-soon" | "time-limited";
  validUntil?: string;
};

export type ProgramPlan = DiscoveryPlanOption;
export type PlanSelections = Record<string, string>;

export type ProgramDetails = {
  name: string;
  officialUrl?: string;
  dimensions: DiscoveryPlanDimension[];
  benefits: ProgramBenefit[];
};

export function selectionKey(cardSlug: string, dimensionSlug: string) {
  return `${cardSlug}.${dimensionSlug}`;
}

export function getProgramName(card: DiscoveryCard) {
  return card.name;
}

export function getProgramDetails(card: DiscoveryCard): ProgramDetails {
  return {
    name: card.name,
    officialUrl: card.officialLink,
    dimensions: card.dimensions,
    benefits: card.benefits,
  };
}

export function getSelectedOptions(card: DiscoveryCard, selections: PlanSelections = {}) {
  return card.dimensions.flatMap((dimension) => {
    const selected = selections[selectionKey(card.slug, dimension.id)];
    const option = dimension.options.find(({ id }) => id === selected) ?? dimension.options[0];
    return option ? [{ dimension, option }] : [];
  });
}

export function getProgramPlan(card: DiscoveryCard, optionId?: string) {
  return card.dimensions.flatMap(({ options }) => options).find(({ id }) => id === optionId)
    ?? card.dimensions[0]?.options[0];
}

export function getCardFact(card: DiscoveryCard, key: CardFactKey, selections: PlanSelections = {}) {
  const selectedValues = getSelectedOptions(card, selections)
    .map(({ option }) => option.facts[key])
    .filter((value): value is string => Boolean(value));
  const values = [...new Set(selectedValues)];
  if (values.length > 0) return values.join(" / ");
  return card.facts[key] ?? "Details unavailable";
}

export function getProgramBenefits(card: DiscoveryCard, selections: PlanSelections = {}) {
  const selectedBenefits = getSelectedOptions(card, selections).flatMap(({ option }) => option.benefits);
  const benefits = [...card.benefits, ...selectedBenefits];
  return [...new Map(benefits.map((benefit) => [`${benefit.kind}:${benefit.title}:${benefit.description}`, benefit])).values()];
}

export function benefitSummary(card: DiscoveryCard, selections: PlanSelections, kind: Exclude<BenefitKind, "rewards">) {
  const matching = getProgramBenefits(card, selections).filter((benefit) => benefit.kind === kind);
  return matching.length ? matching.map(({ title }) => title).join("; ") : "No details yet";
}

export function resolveProgramPlans(cards: readonly DiscoveryCard[], raw: string | string[] | undefined) {
  const requested = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const selections: PlanSelections = {};
  for (const card of cards) {
    for (const dimension of card.dimensions) {
      const key = selectionKey(card.slug, dimension.id);
      const encoded = requested.find((item) => item.startsWith(`${card.slug}:${dimension.id}:`));
      const legacy = card.dimensions.length === 1 ? requested.find((item) => item.startsWith(`${card.slug}:`) && item.split(":").length === 2) : undefined;
      const requestedOption = encoded?.split(":")[2] ?? legacy?.split(":")[1];
      const option = dimension.options.find(({ id }) => id === requestedOption) ?? dimension.options[0];
      if (option) selections[key] = option.id;
    }
  }
  return selections;
}

export function profileSelections(card: DiscoveryCard, raw: string | string[] | undefined) {
  const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const selections: PlanSelections = {};
  for (const dimension of card.dimensions) {
    const encoded = values.find((item) => item.startsWith(`${dimension.id}:`));
    const option = dimension.options.find(({ id }) => id === encoded?.split(":")[1]) ?? dimension.options[0];
    if (option) selections[selectionKey(card.slug, dimension.id)] = option.id;
  }
  return selections;
}

export function profileHref(card: DiscoveryCard, selections: PlanSelections) {
  const params = new URLSearchParams();
  for (const dimension of card.dimensions) {
    const option = selections[selectionKey(card.slug, dimension.id)];
    if (option) params.append("plans", `${dimension.id}:${option}`);
  }
  const query = params.toString();
  return `/cards/${card.slug}${query ? `?${query}` : ""}`;
}
