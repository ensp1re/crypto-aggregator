import type { Prisma } from "@/generated/prisma/client";
import type { PlanDimensionKind, PlanResearchStatus } from "@/generated/prisma/enums";
import type { OfficialSourceDefinition } from "./priority-official-sources";

type JsonObject = Record<string, unknown>;

export type NormalizedCandidatePlanOption = {
  slug: string;
  name: string;
  tierOrder: number;
  qualification: string | null;
  lifecycle: "LIVE" | "WAITLIST" | "PAUSED" | "SUNSET" | null;
  displayValue: string;
  valueJson: Prisma.InputJsonValue;
  scopeJson: Prisma.InputJsonValue;
  sourceFieldKeys: string[];
};

export type NormalizedCandidatePlanDimension = {
  slug: string;
  label: string;
  kind: PlanDimensionKind;
  combinable: boolean;
  displayOrder: number;
  options: NormalizedCandidatePlanOption[];
};

export type CandidatePlanResearchProfile = {
  candidateKey: string;
  status: PlanResearchStatus;
  reason: string;
  dimensions: NormalizedCandidatePlanDimension[];
};

const dimensionKinds = {
  card_plan: "CARD_PLAN",
  subscription: "SUBSCRIPTION",
  membership_level: "MEMBERSHIP_LEVEL",
  reward_tier: "REWARD_TIER",
  reward_category: "REWARD_CATEGORY",
  reward_offer: "REWARD_OFFER",
  loyalty_tier: "LOYALTY_TIER",
  loyalty_level: "LOYALTY_LEVEL",
  loyalty_rank: "LOYALTY_RANK",
  verification_level: "VERIFICATION_LEVEL",
  account_tier: "ACCOUNT_TIER",
  card_mode: "CARD_MODE",
} as const satisfies Record<string, PlanDimensionKind>;

const dimensionLabels: Record<PlanDimensionKind, string> = {
  CARD_PLAN: "Card plan",
  SUBSCRIPTION: "Subscription",
  MEMBERSHIP_LEVEL: "Membership level",
  REWARD_TIER: "Reward tier",
  REWARD_CATEGORY: "Reward category",
  REWARD_OFFER: "Reward offer",
  LOYALTY_TIER: "Loyalty tier",
  LOYALTY_LEVEL: "Loyalty level",
  LOYALTY_RANK: "Loyalty rank",
  VERIFICATION_LEVEL: "Verification level",
  ACCOUNT_TIER: "Account tier",
  CARD_MODE: "Card mode",
};

const metadataKeys = new Set([
  "afterCapPercent",
  "annualFee",
  "currency",
  "maximumLevel",
  "minimumLevel",
  "monthlyFee",
  "period",
  "rebatePercent",
  "rewardAsset",
]);

function asObject(value: unknown): JsonObject | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as JsonObject : null;
}

function slugify(value: string) {
  return value.normalize("NFKD").toLowerCase().replaceAll("+", " plus ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function titleCase(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function explicitOptionNames(value: JsonObject | null, scope: JsonObject) {
  const scopedNames = scope.optionNames;
  if (Array.isArray(scopedNames)) return scopedNames.filter((name): name is string => typeof name === "string");

  for (const key of ["plans", "tiers", "levels", "modes", "categories"] as const) {
    const items = value?.[key];
    if (!Array.isArray(items)) continue;
    return items.flatMap((item) => {
      if (typeof item === "string") return [item];
      const object = asObject(item);
      return typeof object?.name === "string" ? [object.name] : [];
    });
  }

  if (typeof value?.name === "string") return [value.name];
  if (typeof value?.plan === "string") return [value.plan];
  if (typeof scope.plan === "string") return [scope.plan];
  if (typeof scope.tier === "string") return [scope.tier];
  if (typeof value?.minimumLevel === "number" && typeof value.maximumLevel === "number") {
    return Array.from({ length: value.maximumLevel - value.minimumLevel + 1 }, (_, index) => `Level ${(value.minimumLevel as number) + index}`);
  }

  return Object.entries(value ?? {})
    .filter(([key, item]) => !metadataKeys.has(key) && asObject(item))
    .map(([key]) => titleCase(key));
}

function optionPayload(name: string, value: JsonObject | null) {
  if (!value) return null;
  if (value.name === name) return value;
  for (const key of ["plans", "tiers", "levels", "modes", "categories"] as const) {
    const item = Array.isArray(value[key]) ? value[key].find((entry) => asObject(entry)?.name === name) : undefined;
    if (item) return asObject(item);
  }
  const direct = value[name] ?? value[slugify(name)] ?? value[name.replaceAll(" ", "_")];
  return asObject(direct);
}

function lifecycleFrom(scope: JsonObject) {
  const lifecycle = scope.lifecycle;
  return lifecycle === "LIVE" || lifecycle === "WAITLIST" || lifecycle === "PAUSED" || lifecycle === "SUNSET" ? lifecycle : null;
}

export function normalizeCandidatePlanResearch(
  sources: OfficialSourceDefinition[],
  blockerKeys: ReadonlySet<string>,
): CandidatePlanResearchProfile[] {
  const factsByCandidate = new Map<string, OfficialSourceDefinition["facts"]>();
  for (const source of sources) {
    const current = factsByCandidate.get(source.candidateKey) ?? [];
    current.push(...source.facts);
    factsByCandidate.set(source.candidateKey, current);
  }

  const profiles: CandidatePlanResearchProfile[] = [];
  for (const [candidateKey, facts] of factsByCandidate) {
    if (blockerKeys.has(candidateKey)) continue;
    const dimensionFacts = new Map<string, typeof facts>();
    for (const fact of facts) {
      const scope = asObject(fact.scopeJson);
      const dimension = typeof scope?.dimension === "string" ? scope.dimension : null;
      if (!dimension || !(dimension in dimensionKinds)) continue;
      const current = dimensionFacts.get(dimension) ?? [];
      current.push(fact);
      dimensionFacts.set(dimension, current);
    }

    const dimensions = [...dimensionFacts.entries()].map(([slug, scopedFacts], dimensionIndex) => {
      const kind = dimensionKinds[slug as keyof typeof dimensionKinds];
      const optionMap = new Map<string, { name: string; facts: typeof scopedFacts }>();
      for (const fact of scopedFacts) {
        const value = asObject(fact.valueJson);
        const scope = asObject(fact.scopeJson) ?? {};
        for (const name of explicitOptionNames(value, scope)) {
          const optionSlug = slugify(name);
          const existing = optionMap.get(optionSlug);
          if (existing) existing.facts.push(fact);
          else optionMap.set(optionSlug, { name, facts: [fact] });
        }
      }

      const orderedOptionSlugs = [...optionMap.keys()];
      for (const fact of facts) {
        if (scopedFacts.includes(fact)) continue;
        const value = asObject(fact.valueJson);
        const scope = asObject(fact.scopeJson) ?? {};
        const namedScopes = [scope.plan, scope.tier, ...asArrayOfStrings(scope.plans), ...asArrayOfStrings(scope.tiers)]
          .filter((name): name is string => typeof name === "string");
        for (const name of namedScopes) optionMap.get(slugify(name))?.facts.push(fact);

        const minimum = typeof value?.minimumRewardTier === "string"
          ? value.minimumRewardTier
          : typeof scope.minimumRewardTier === "string" ? scope.minimumRewardTier : null;
        const minimumIndex = minimum ? orderedOptionSlugs.indexOf(slugify(minimum)) : -1;
        if (minimumIndex >= 0) {
          for (const optionSlug of orderedOptionSlugs.slice(minimumIndex)) optionMap.get(optionSlug)?.facts.push(fact);
        }
      }

      const options = [...optionMap.entries()].map(([optionSlug, option], optionIndex) => {
        const primary = option.facts.find((fact) => asObject(fact.valueJson)?.name === option.name || asObject(fact.scopeJson)?.plan === option.name || asObject(fact.scopeJson)?.tier === option.name) ?? option.facts[0];
        const primaryValue = asObject(primary.valueJson);
        const primaryScope = asObject(primary.scopeJson) ?? {};
        const payload = optionPayload(option.name, primaryValue);
        const tierOrder = typeof payload?.tierOrder === "number" ? payload.tierOrder : typeof primaryValue?.tierOrder === "number" ? primaryValue.tierOrder : optionIndex + 1;
        const qualification = typeof primaryScope.qualification === "string" ? primaryScope.qualification : typeof primaryScope.qualificationWindow === "string" ? primaryScope.qualificationWindow : null;
        return {
          slug: optionSlug,
          name: option.name,
          tierOrder,
          qualification,
          lifecycle: lifecycleFrom(primaryScope),
          displayValue: primary.displayValue,
          valueJson: { observations: option.facts.map((fact) => ({ fieldKey: fact.fieldKey, displayValue: fact.displayValue, value: fact.valueJson ?? null, scope: fact.scopeJson })) },
          scopeJson: { observations: option.facts.map((fact) => fact.scopeJson) },
          sourceFieldKeys: [...new Set(option.facts.map((fact) => fact.fieldKey))],
        } satisfies NormalizedCandidatePlanOption;
      }).sort((left, right) => left.tierOrder - right.tierOrder || left.name.localeCompare(right.name));

      options.forEach((option, index) => { option.tierOrder = index + 1; });
      return {
        slug,
        label: dimensionLabels[kind],
        kind,
        combinable: dimensionFacts.size > 1 || scopedFacts.some((fact) => Boolean(asObject(fact.scopeJson)?.combinesWith)),
        displayOrder: dimensionIndex + 1,
        options,
      } satisfies NormalizedCandidatePlanDimension;
    });

    const structuredCount = dimensions.filter(({ options }) => options.length > 0).length;
    const status: PlanResearchStatus = dimensions.length === 0 ? "NO_PUBLIC_MATRIX" : structuredCount === dimensions.length ? "STRUCTURED" : "PARTIAL";
    const reason = status === "STRUCTURED"
      ? `${dimensions.length} selectable dimension${dimensions.length === 1 ? "" : "s"} normalized from official evidence.`
      : status === "PARTIAL"
        ? "An official plan-dependent program was found, but at least one complete selectable matrix is not public."
        : "Collected official sources do not expose a separate public card-plan or reward-tier matrix.";
    profiles.push({ candidateKey, status, reason, dimensions });
  }
  return profiles;
}

function asArrayOfStrings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
