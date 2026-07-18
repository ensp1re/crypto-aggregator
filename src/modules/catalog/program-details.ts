import type { DiscoveryCard } from "./discovery";

export type CardFactKey =
  | "regions"
  | "kyc"
  | "custody"
  | "type"
  | "network"
  | "supportedAssets"
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
  status?: "coming-soon";
};

export type ProgramPlan = {
  id: string;
  name: string;
  summary: string;
  facts: Partial<Record<CardFactKey, string>>;
  benefits: ProgramBenefit[];
};

export type ProgramDetails = {
  name: string;
  officialUrl: string;
  sourceUrl: string;
  sourceLabel: string;
  defaultPlan?: string;
  plans?: ProgramPlan[];
  benefits?: ProgramBenefit[];
  planNote?: string;
};

const programDetails: Record<string, ProgramDetails> = {
  "ready-lite": {
    name: "Ready Card",
    officialUrl: "https://www.ready.co/card",
    sourceUrl: "https://www.ready.co/blog/card-faqs",
    sourceLabel: "Ready Card FAQs",
    defaultPlan: "lite",
    plans: [
      {
        id: "lite",
        name: "Lite",
        summary: "The free plastic card for everyday spending.",
        facts: {
          type: "Plastic debit card",
          supportedAssets: "USDC",
          annualFee: "Free; $6.99 physical-card shipping",
          fxFee: "1%",
          atmLimit: "2% fee on ATM withdrawals",
          cashbackMax: "Ready Points; current earn rate shown in the app",
          stakingRequired: "None",
        },
        benefits: [
          {
            kind: "travel",
            title: "Ready Travel",
            description: "Cardholder rates and offers for flights, hotels, and other travel booked in the Ready app.",
          },
          {
            kind: "rewards",
            title: "Ready Points",
            description: "Earn Points on eligible card activity. Current earn rates are shown in the Ready app.",
          },
        ],
      },
      {
        id: "metal",
        name: "Metal",
        summary: "The premium metal card with higher rewards and partner perks.",
        facts: {
          type: "16g metal debit card",
          supportedAssets: "USDC",
          annualFee: "120 USDC for the first year",
          fxFee: "0%",
          atmLimit: "$800/month fee-free, then 2%",
          cashbackMax: "Up to 3% back in Ready Points",
          stakingRequired: "None",
        },
        benefits: [
          {
            kind: "travel",
            title: "Ready Travel",
            description: "Cardholder rates and offers for flights, hotels, and other travel booked in the Ready app.",
          },
          {
            kind: "partner",
            title: "Partner offers",
            description: "Offers from Layerswap, Koinly, Nansen, StarknetID, Airalo, and NordVPN. Terms can change.",
          },
          {
            kind: "rewards",
            title: "Boosted Ready Points",
            description: "The highest Ready Points earning rate on eligible card spending and activity.",
          },
        ],
      },
    ],
    benefits: [
      {
        kind: "subscriptions",
        title: "Subscription savings",
        description: "Use Ready Points for Claude, Netflix, and Spotify with 25% more value.",
        status: "coming-soon",
      },
      {
        kind: "wallet",
        title: "Google Pay",
        description: "Add the virtual card to Google Pay. Apple Pay is listed as coming soon.",
      },
    ],
  },
  "wirex-card": {
    name: "Wirex Card",
    officialUrl: "https://www.wirexapp.com/en-sg/stablecoin-and-crypto-card",
    sourceUrl: "https://www.wirexapp.com/en-sg/stablecoin-and-crypto-card",
    sourceLabel: "Wirex One card page",
    planNote: "Five membership tiers: Base, Premium, Elite, Private, and Bespoke. The tier depends on portfolio size and WPAY share.",
    benefits: [
      {
        kind: "subscriptions",
        title: "50% subscription refunds",
        description: "Eligible plans include ChatGPT Plus, Claude Pro, Perplexity Pro, Uber One, Whoop, Bloomberg, and the Financial Times. Access varies by tier.",
      },
      {
        kind: "rewards",
        title: "0.5% to 8% cashback",
        description: "The rate depends on the current Wirex One membership tier.",
      },
      {
        kind: "wallet",
        title: "Apple Pay and Google Pay",
        description: "The virtual card can be added to either supported mobile wallet.",
      },
    ],
  },
};

export function getProgramDetails(slug: string) {
  return programDetails[slug];
}

export function getProgramName(card: DiscoveryCard) {
  return getProgramDetails(card.slug)?.name ?? card.name;
}

export function getProgramPlan(slug: string, requested?: string) {
  const details = getProgramDetails(slug);
  if (!details?.plans?.length) return undefined;
  return details.plans.find((plan) => plan.id === requested)
    ?? details.plans.find((plan) => plan.id === details.defaultPlan)
    ?? details.plans[0];
}

export function getProgramBenefits(slug: string, planId?: string) {
  const details = getProgramDetails(slug);
  const plan = getProgramPlan(slug, planId);
  return [...(plan?.benefits ?? []), ...(details?.benefits ?? [])];
}

export function getCardFact(card: DiscoveryCard, key: CardFactKey, planId?: string) {
  const override = getProgramPlan(card.slug, planId)?.facts[key];
  if (override !== undefined) return override;
  if (key === "cashbackMax") {
    if (typeof card.cashbackMax === "number") return `${card.cashbackMax}%`;
    return card.cashbackMax ?? "Details unavailable";
  }
  return String(card[key]);
}

export function benefitSummary(slug: string, planId: string | undefined, kind: BenefitKind) {
  const matches = getProgramBenefits(slug, planId).filter((benefit) => benefit.kind === kind);
  if (matches.length === 0) return "No details yet";
  return matches.map((benefit) => `${benefit.title}${benefit.status === "coming-soon" ? " (coming soon)" : ""}`).join("; ");
}

export function resolveProgramPlans(slugs: readonly string[], raw: string | string[] | undefined) {
  const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const selections: Record<string, string> = {};

  for (const value of values) {
    const [slug, planId] = value.toLowerCase().split(":", 2);
    if (!slugs.includes(slug) || !planId) continue;
    const plan = getProgramDetails(slug)?.plans?.find((candidate) => candidate.id === planId);
    if (plan) selections[slug] = plan.id;
  }

  return selections;
}
