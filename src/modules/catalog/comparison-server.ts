import { normalizeComparisonSlugs, type CompareOption } from "./comparison";
import { getDiscoverySnapshot, type DiscoveryCard } from "./discovery";

export function getCompareOptions(): CompareOption[] {
  return getDiscoverySnapshot().cards.map(({ slug, name, issuer, regions, custody, network }) => ({
    slug,
    name,
    issuer,
    regions,
    custody,
    network,
  }));
}

export function resolveComparisonCards(raw: string | string[] | undefined) {
  const cards = getDiscoverySnapshot().cards;
  const slugs = normalizeComparisonSlugs(raw, cards.map((card) => card.slug));
  return slugs
    .map((slug) => cards.find((card) => card.slug === slug))
    .filter((card): card is DiscoveryCard => Boolean(card));
}
