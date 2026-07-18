import { normalizeComparisonSlugs, type CompareOption } from "./comparison";
import { getDiscoverySnapshot, type DiscoveryCard } from "./discovery";

export async function getCompareOptions(): Promise<CompareOption[]> {
  const { cards } = await getDiscoverySnapshot();
  return cards.map(({ slug, name, issuer, regions, custody, network }) => ({
    slug,
    name,
    issuer,
    regions,
    custody,
    network,
  }));
}

export async function resolveComparisonCards(raw: string | string[] | undefined) {
  const { cards } = await getDiscoverySnapshot();
  const slugs = normalizeComparisonSlugs(raw, cards.map((card) => card.slug));
  return slugs
    .map((slug) => cards.find((card) => card.slug === slug))
    .filter((card): card is DiscoveryCard => Boolean(card));
}
