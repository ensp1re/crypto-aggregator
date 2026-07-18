import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getDiscoverySnapshot } from "@/modules/catalog/discovery";

export const revalidate = 86_400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const snapshot = await getDiscoverySnapshot();
  const catalogModified = snapshot.observedAt ? new Date(snapshot.observedAt) : undefined;
  const entry = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly") => ({
    url: `${SITE_URL}${path}`,
    lastModified: catalogModified,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1),
    entry("/cards", 0.95, "daily"),
    entry("/compare", 0.85),
    entry("/analytics", 0.75),
    ...snapshot.cards
      .filter(({ verification }) => verification === "official-research")
      .map((card) => {
        const observedAt = card.observations.map(({ observedAt }) => observedAt).sort().at(-1);
        return {
          url: `${SITE_URL}/cards/${card.slug}`,
          lastModified: observedAt ? new Date(observedAt) : catalogModified,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };
      }),
  ];
}
