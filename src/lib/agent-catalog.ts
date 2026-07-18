import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { DiscoveryCard } from "@/modules/catalog/discovery";
import { unavailable, type CardFactKey } from "@/modules/catalog/program-details";

const factLabels: Record<CardFactKey, string> = {
  regions: "Regions",
  kyc: "KYC",
  custody: "Funding model",
  type: "Card model",
  network: "Payment network",
  supportedAssets: "Supported assets",
  fundingFee: "Funding or top-up fee",
  annualFee: "Annual fee",
  fxFee: "FX fee",
  atmLimit: "ATM fees and limits",
  cashbackMax: "Rewards",
  stakingRequired: "Requirements",
};

const factKeys = Object.keys(factLabels) as CardFactKey[];

function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
}

function officialFacts(card: DiscoveryCard) {
  return Object.fromEntries(factKeys.flatMap((key) => {
    const value = card.facts[key];
    return card.factSources[key] === "official" && value && value !== unavailable
      ? [[key, { label: factLabels[key], value: oneLine(value) }]]
      : [];
  }));
}

function sources(card: DiscoveryCard) {
  const byUrl = new Map<string, string>();
  for (const observation of card.observations) {
    const previous = byUrl.get(observation.sourceUrl);
    if (!previous || observation.observedAt > previous) byUrl.set(observation.sourceUrl, observation.observedAt);
  }
  return [...byUrl].map(([url, observedAt]) => ({ url, observedAt }));
}

export function buildAgentCatalog(snapshot: { cards: DiscoveryCard[]; observedAt?: string }) {
  const cards = snapshot.cards.filter(({ verification }) => verification === "official-research").map((card) => ({
    name: oneLine(card.name),
    issuer: oneLine(card.issuer),
    canonicalUrl: `${SITE_URL}/cards/${card.slug}`,
    ...(card.officialLink ? { officialWebsite: card.officialLink } : {}),
    evidenceStatus: "Issuer-source research; independent verification pending",
    facts: officialFacts(card),
    plans: card.dimensions.map((dimension) => ({
      id: dimension.id,
      label: oneLine(dimension.label),
      kind: dimension.kind,
      combinable: dimension.combinable,
      options: dimension.options.map((option) => ({
        id: option.id,
        name: oneLine(option.name),
        summary: oneLine(option.summary),
        ...(option.qualification ? { qualification: oneLine(option.qualification) } : {}),
        facts: Object.fromEntries(Object.entries(option.facts).filter(([, value]) => value && value !== unavailable)),
        benefits: option.benefits,
      })),
    })),
    benefits: card.benefits,
    sources: sources(card),
  }));

  return {
    schemaVersion: "1.0",
    name: `${SITE_NAME} agent catalog`,
    canonicalUrl: `${SITE_URL}/cards`,
    generatedFrom: "Public issuer-source observations in the CardStats database",
    observedAt: snapshot.observedAt,
    evidencePolicy: [
      "Unknown values are omitted, never converted to zero.",
      "Plans and tiers remain inside one card program.",
      "Promotions remain separate from durable card economics.",
      "Commercial relationships do not affect ordering.",
      "Open the canonical profile and linked issuer sources before relying on a value.",
    ],
    cardCount: cards.length,
    cards,
  };
}

export function agentCatalogMarkdown(catalog: ReturnType<typeof buildAgentCatalog>) {
  const lines = [
    "# CardStats agent catalog",
    "",
    `Canonical catalog: ${catalog.canonicalUrl}`,
    `Latest source observation: ${catalog.observedAt ?? "Not available"}`,
    `Researched card programs: ${catalog.cardCount}`,
    "",
    "## Evidence policy",
    "",
    ...catalog.evidencePolicy.map((policy) => `- ${policy}`),
  ];

  for (const card of catalog.cards) {
    lines.push("", `## ${card.name}`, "", `- Canonical profile: ${card.canonicalUrl}`, `- Issuer: ${card.issuer}`, `- Evidence status: ${card.evidenceStatus}`);
    if (card.officialWebsite) lines.push(`- Official website: ${card.officialWebsite}`);
    for (const fact of Object.values(card.facts)) lines.push(`- ${fact.label}: ${fact.value}`);
    for (const dimension of card.plans) {
      lines.push(`- ${dimension.label}: ${dimension.options.map(({ name }) => name).join(", ")}`);
    }
    if (card.benefits.length) lines.push(`- Benefits: ${card.benefits.map(({ title }) => oneLine(title)).join(", ")}`);
    if (card.sources.length) {
      lines.push("- Primary sources:");
      for (const source of card.sources) lines.push(`  - ${source.url} (observed ${source.observedAt})`);
    }
  }

  return `${lines.join("\n")}\n`;
}
