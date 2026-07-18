import type { DiscoveryCard } from "./discovery";
import { getProgramResearch, type ProgramResearch } from "./program-research";

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

export type ProgramPlan = {
  id: string;
  name: string;
  summary: string;
  facts: Partial<Record<CardFactKey, string>>;
  benefits: ProgramBenefit[];
};

export type ProgramDetails = ProgramResearch & {
  defaultPlan?: string;
  selectionLabel?: string;
  plans?: ProgramPlan[];
  benefits?: ProgramBenefit[];
  planNote?: string;
};

type ProgramDetailsExtension = Omit<ProgramDetails, keyof ProgramResearch>;

const programDetails: Record<string, ProgramDetailsExtension> = {
  kripicard: {
    planNote: "One current Premium virtual card: $5 issuance, 4% funding, and $1 processing. Cashback is on the Q4 2026 roadmap, not a current benefit.",
    benefits: [
      { kind: "wallet", title: "Apple Pay, Google Pay, and Samsung Pay", description: "The current virtual card supports all three mobile wallets." },
    ],
  },
  "kast-card": {
    selectionLabel: "plan",
    defaultPlan: "standard",
    planNote: "KAST labels these rates as Season 5 rewards. They remain time-limited until the season dates and reward terms are captured.",
    plans: [
      {
        id: "standard",
        name: "Standard",
        summary: "The free entry plan with seasonal rewards.",
        facts: { annualFee: "Free", cashbackMax: "2% Season 5 rewards" },
        benefits: [{ kind: "rewards", title: "2% Season 5 rewards", description: "A seasonal KAST reward rate, not a permanent cashback guarantee.", status: "time-limited" }],
      },
      {
        id: "premium",
        name: "Premium",
        summary: "The annual premium plan with a higher seasonal reward rate.",
        facts: { annualFee: "$1,000/year", cashbackMax: "5% Season 5 rewards" },
        benefits: [{ kind: "rewards", title: "5% Season 5 rewards", description: "A seasonal KAST reward rate, not a permanent cashback guarantee.", status: "time-limited" }],
      },
      {
        id: "limited",
        name: "Limited",
        summary: "A one-time-purchase plan with concierge access.",
        facts: { annualFee: "$5,000 one-time", cashbackMax: "5% Season 5 rewards" },
        benefits: [
          { kind: "rewards", title: "5% Season 5 rewards", description: "A seasonal KAST reward rate, not a permanent cashback guarantee.", status: "time-limited" },
          { kind: "travel", title: "Concierge", description: "Concierge access is advertised for the Limited plan." },
        ],
      },
      {
        id: "luxe",
        name: "Luxe",
        summary: "The highest-priced concierge plan.",
        facts: { annualFee: "From $10,000/year", cashbackMax: "8% Season 5 rewards" },
        benefits: [
          { kind: "rewards", title: "8% Season 5 rewards", description: "A seasonal KAST reward rate, not a permanent cashback guarantee.", status: "time-limited" },
          { kind: "travel", title: "Concierge", description: "Concierge access is advertised for the Luxe plan." },
        ],
      },
    ],
  },
  "gemini-card": {
    benefits: [
      { kind: "rewards", title: "Category crypto rewards", description: "4% on gas, EV charging, and transit on the first $300 of monthly category spend, then 1%; 3% dining, 2% groceries, and 1% other qualifying purchases." },
      { kind: "partner", title: "Vault offers", description: "Merchant-specific offers can reach 10%; each offer has its own eligibility and limits." },
    ],
  },
  "metamask-card": {
    selectionLabel: "plan",
    defaultPlan: "virtual",
    planNote: "New US and UK sign-ups are paused. New Metal orders have been paused since 2 June 2026.",
    plans: [
      {
        id: "virtual",
        name: "Virtual",
        summary: "The free virtual plan with base mUSD rewards.",
        facts: { type: "Virtual debit card", annualFee: "Free", fxFee: "No additional MetaMask fee; Mastercard rate applies", cashbackMax: "1% in mUSD" },
        benefits: [
          { kind: "rewards", title: "1% in mUSD", description: "Earned on eligible card spend under the current reward terms." },
          { kind: "travel", title: "Entravel hotel benefit", description: "Eligible Entravel checkout can bring total value to 5%." },
        ],
      },
      {
        id: "metal",
        name: "Metal",
        summary: "The paid metal plan; new orders are currently paused.",
        facts: { type: "Metal debit card", annualFee: "$199/year", fxFee: "No additional MetaMask fee; Mastercard rate applies", cashbackMax: "3% on the first $10,000 yearly, then 1%" },
        benefits: [
          { kind: "rewards", title: "Boosted mUSD rewards", description: "3% on the first $10,000 of yearly eligible spend, then 1%." },
          { kind: "travel", title: "Entravel hotel benefit", description: "Eligible Entravel checkout can bring total value to 7%." },
        ],
      },
    ],
    benefits: [
      { kind: "partner", title: "Blackbird dining offers", description: "Eligible Blackbird dining offers can earn FLY benefits under Blackbird terms." },
    ],
  },
  "ready-lite": {
    selectionLabel: "plan",
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
  "bitrefill-card": {
    benefits: [
      { kind: "rewards", title: "Store-credit rewards", description: "1% on crypto deposits and 1% on eligible card spend, redeemable as euro Bitrefill store credit." },
      { kind: "partner", title: "Monthly travel eSIM", description: "A free monthly 20GB eSIM after depositing more than €500, subject to current program terms." },
    ],
  },
  "whitebit-card": {
    benefits: [
      { kind: "rewards", title: "Choose three cashback categories", description: "Official examples include 10% subscriptions, 5% taxis, and 1% groceries or restaurants, with a €25 monthly maximum." },
    ],
  },
  "gnosis-card": {
    planNote: "The current GNO-holding reward program is a dated promotion, not a permanent card tier table.",
    benefits: [
      { kind: "rewards", title: "GNO-holder cashback", description: "Holding 0.1, 1, 10, or 100 GNO currently maps to 1%, 2%, 3%, or 4% base cashback with weekly caps. An eligible OG NFT adds 1%.", status: "time-limited", validUntil: "30 September 2026" },
    ],
  },
  "fold-card": {
    selectionLabel: "membership",
    defaultPlan: "member",
    plans: [
      {
        id: "member",
        name: "Member",
        summary: "The free Fold debit membership.",
        facts: { annualFee: "Free", cashbackMax: "Merchant boosts; no equivalent base rate listed" },
        benefits: [{ kind: "partner", title: "Merchant boosts", description: "Eligible merchant boosts vary under the current Fold rewards program." }],
      },
      {
        id: "fold-plus",
        name: "Fold+",
        summary: "The paid debit membership with base category rewards.",
        facts: { annualFee: "$10/month or $100/year", cashbackMax: "1.5% dining/travel; 0.5% other eligible spend" },
        benefits: [
          { kind: "rewards", title: "Fold+ base rewards", description: "1.5% on eligible dining and travel and 0.5% on other eligible card spend." },
          { kind: "partner", title: "Merchant boosts", description: "Eligible merchant boosts can reach 15%." },
        ],
      },
    ],
  },
  "bleap-card": {
    benefits: [
      { kind: "rewards", title: "Category cashback", description: "1% default, 3% at named mobility and delivery merchants, and 20% on selected streaming, AI, and gaming subscriptions, subject to merchant caps." },
      { kind: "subscriptions", title: "Selected subscriptions", description: "20% cashback at named streaming, AI, and gaming merchants, subject to merchant-specific fair-use caps." },
    ],
  },
  "bitpanda-card": {
    benefits: [
      { kind: "rewards", title: "1% eligible-crypto cashback", description: "Applies to eligible purchases funded with qualifying crypto; fiat, stablecoin, metal, and stock-funded purchases do not qualify." },
    ],
  },
  "ledger-card": {
    benefits: [
      { kind: "rewards", title: "1% crypto rewards", description: "The current page lists BTC or USDC in the US and BTC or USDT in other supported markets." },
      { kind: "wallet", title: "Apple Pay and Google Pay", description: "The virtual CL Card supports both mobile wallets in eligible regions." },
    ],
  },
  "tuyo-card": {
    benefits: [
      { kind: "rewards", title: "TUYOs points", description: "Points exist, but the current earn rate and mechanics depend on app and program terms." },
      { kind: "wallet", title: "Physical card and ATM access", description: "Both are listed as future features rather than current availability.", status: "coming-soon" },
    ],
  },
  "redotpay-card": {
    selectionLabel: "subscription",
    defaultPlan: "standard",
    plans: [
      {
        id: "standard",
        name: "Standard",
        summary: "The base card without a recurring management fee.",
        facts: { annualFee: "No recurring fee; $10 virtual or $100 physical issuance", cashbackMax: "No durable base cashback found" },
        benefits: [],
      },
      {
        id: "pro-monthly",
        name: "Pro monthly",
        summary: "The monthly Pro membership with an included virtual card.",
        facts: { annualFee: "$12.90/month", cashbackMax: "3% on Apple Pay and Google Pay purchases; $18/month cap" },
        benefits: [
          { kind: "rewards", title: "Mobile-wallet cashback", description: "3% on eligible Apple Pay and Google Pay purchases, capped at $18 per month." },
          { kind: "wallet", title: "One included virtual card", description: "Included with the monthly Pro membership." },
        ],
      },
      {
        id: "pro-annual",
        name: "Pro annual",
        summary: "The annual Pro membership with a physical card and larger allowances.",
        facts: { annualFee: "$129/year", atmLimit: "ATM fee waiver up to $1,000/month", cashbackMax: "3% on Apple Pay and Google Pay purchases; $18/month cap" },
        benefits: [
          { kind: "rewards", title: "Mobile-wallet cashback", description: "3% on eligible Apple Pay and Google Pay purchases, capped at $18 per month." },
          { kind: "wallet", title: "One included physical card", description: "Included with the annual Pro membership." },
          { kind: "partner", title: "Earn boost", description: "An additional Earn benefit is available in eligible regions." },
        ],
      },
    ],
  },
  "tria-card": {
    selectionLabel: "plan",
    defaultPlan: "virtual",
    planNote: "Staking badges can add 0.25% to 2%. Dated campaigns are kept separate from these base plan rates.",
    plans: [
      { id: "virtual", name: "Virtual", summary: "The entry virtual plan.", facts: { type: "Virtual card", cashbackMax: "1.5% within the plan cap, then a lower rate" }, benefits: [{ kind: "rewards", title: "1.5% base plan rate", description: "Applies within the Virtual plan spend cap before its lower fallback rate." }] },
      { id: "signature", name: "Signature", summary: "The mid-tier plan with higher rewards and card benefits.", facts: { cashbackMax: "4.5% within the plan cap, then a lower rate" }, benefits: [{ kind: "rewards", title: "4.5% base plan rate", description: "Applies within the Signature plan spend cap before its lower fallback rate." }, { kind: "travel", title: "Plan-dependent travel benefits", description: "Lounge, baggage, and protection eligibility depends on the exact plan terms." }] },
      { id: "premium", name: "Premium", summary: "The highest listed plan with the largest base reward rate.", facts: { cashbackMax: "6% within the plan cap, then a lower rate" }, benefits: [{ kind: "rewards", title: "6% base plan rate", description: "Applies within the Premium plan spend cap before its lower fallback rate." }, { kind: "travel", title: "Plan-dependent travel benefits", description: "Lounge, baggage, and protection eligibility depends on the exact plan terms." }] },
    ],
  },
  "oobit-card": {
    benefits: [
      { kind: "rewards", title: "OOB-funded 5X reward", description: "10% on eligible OOB-funded transactions up to $10,000 monthly. Other assets have separate, smaller allowances." },
      { kind: "wallet", title: "In-app reward use", description: "Reward USDC or USDT is restricted to Oobit Tap to Pay and is not freely withdrawable cash." },
    ],
  },
  "deblock-card": {
    selectionLabel: "plan",
    defaultPlan: "standard",
    plans: [
      { id: "standard", name: "Standard", summary: "The free standard subscription.", facts: { annualFee: "Free", cashbackMax: "No card cashback listed" }, benefits: [] },
      { id: "premium", name: "Premium", summary: "The paid subscription with card cashback and larger allowances.", facts: { annualFee: "€14.99/month or €120/year", cashbackMax: "Up to 1%" }, benefits: [{ kind: "rewards", title: "Up to 1% card cashback", description: "Available under the current Premium fee and benefit schedule." }, { kind: "partner", title: "Larger allowances", description: "More cards, larger ATM and FX allowances, and lower crypto trading fees than Standard." }] },
      { id: "native", name: "Native", summary: "The NFT-unlocked plan with Premium-like card benefits.", facts: { annualFee: "Free after holding a Deblock NFT for at least 30 days", cashbackMax: "Up to 1%" }, benefits: [{ kind: "rewards", title: "Up to 1% card cashback", description: "Available under the current Native fee and benefit schedule." }, { kind: "partner", title: "NFT card customization", description: "Includes card customization and expanded card and allowance benefits." }] },
    ],
  },
  "fiat24-card": {
    selectionLabel: "account tier",
    defaultPlan: "standard",
    plans: [
      { id: "standard", name: "Standard", summary: "The entry account-NFT tier.", facts: { fundingFee: "1% crypto top-up fee" }, benefits: [{ kind: "wallet", title: "Mobile wallets", description: "Apple Pay, Google Pay, and Samsung Pay are supported." }] },
      { id: "premium", name: "Premium", summary: "The middle account-NFT tier with lower top-up fees and higher limits.", facts: { fundingFee: "0.5% crypto top-up fee" }, benefits: [{ kind: "wallet", title: "Mobile wallets", description: "Apple Pay, Google Pay, and Samsung Pay are supported." }] },
      { id: "ultimate", name: "Ultimate", summary: "The highest account-NFT tier with the lowest listed top-up fee.", facts: { fundingFee: "0.25% crypto top-up fee" }, benefits: [{ kind: "wallet", title: "Mobile wallets", description: "Apple Pay, Google Pay, and Samsung Pay are supported." }] },
    ],
  },
  "wirex-card": {
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
  const research = getProgramResearch(slug);
  if (!research) return undefined;
  return { ...research, ...programDetails[slug] } satisfies ProgramDetails;
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
  if (key === "fundingFee") return "Details unavailable";
  return String(card[key]);
}

export function benefitSummary(slug: string, planId: string | undefined, kind: BenefitKind) {
  const matches = getProgramBenefits(slug, planId).filter((benefit) => benefit.kind === kind);
  if (matches.length === 0) return "No details yet";
  return matches.map((benefit) => {
    if (benefit.status === "coming-soon") return `${benefit.title} (coming soon)`;
    if (benefit.status === "time-limited") return `${benefit.title} (time-limited${benefit.validUntil ? ` through ${benefit.validUntil}` : ""})`;
    return benefit.title;
  }).join("; ");
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
