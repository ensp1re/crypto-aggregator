import snapshot from "./discovery-snapshot.json";
import { officialIssuerMedia, type OfficialIssuerMedia } from "./official-media";
import { getProgramResearch } from "./program-research";

export type DiscoveryCard = (typeof snapshot.cards)[number] & {
  slug: string;
  verification: "discovery";
  media?: OfficialIssuerMedia;
};

export type CatalogQuery = {
  query?: string;
  custody?: string;
  network?: string;
};

const cards: DiscoveryCard[] = snapshot.cards.map((card) => {
  const slug = card.id.toLowerCase();
  const research = getProgramResearch(slug);
  return {
    ...card,
    name: research?.name ?? card.name,
    officialLink: research?.officialUrl ?? card.officialLink,
    logo: officialIssuerMedia[card.id]?.path ?? card.logo,
    slug,
    verification: "discovery",
    media: officialIssuerMedia[card.id],
  };
});

export function getDiscoverySnapshot() {
  return { ...snapshot, cards };
}

export function getDiscoveryCard(slug: string) {
  return cards.find((card) => card.slug === slug.toLowerCase());
}

export function filterDiscoveryCards({ query = "", custody = "all", network = "all" }: CatalogQuery) {
  const normalizedQuery = query.trim().toLowerCase();
  return cards.filter((card) => {
    const matchesQuery = !normalizedQuery || [card.name, card.issuer, card.regions, card.supportedAssets]
      .some((value) => value.toLowerCase().includes(normalizedQuery));
    const matchesCustody = custody === "all" || card.custody === custody;
    const matchesNetwork = network === "all" || card.network === network;
    return matchesQuery && matchesCustody && matchesNetwork;
  });
}

export function distribution(field: "custody" | "network" | "type") {
  const counts = new Map<string, number>();
  for (const card of cards) counts.set(card[field], (counts.get(card[field]) ?? 0) + 1);
  return [...counts].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

export function maximumReward(card: DiscoveryCard) {
  if (typeof card.cashbackMax === "number") return `${card.cashbackMax}%`;
  return card.cashbackMax ?? "Details unavailable";
}
