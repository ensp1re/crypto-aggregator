import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL, pageMetadata } from "@/lib/seo";
import { getDiscoverySnapshot, maximumReward } from "@/modules/catalog/discovery";

export const metadata: Metadata = pageMetadata({
  title: "Crypto Card Index: Fees, Rewards & Tiers",
  description: "Browse crypto cards and compare fees, cashback, funding models, regions, payment networks, plans, and benefits in one independent index.",
  path: "/cards",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CardsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const value = (name: string) => typeof params[name] === "string" ? params[name] : undefined;
  const query = value("q") ?? "";
  const network = value("network") ?? "all";
  const snapshot = await getDiscoverySnapshot();
  const cards = snapshot.cards.map((card) => ({
    cashbackMax: maximumReward(card),
    custody: card.custody,
    id: card.id,
    issuer: card.issuer,
    logo: card.logo,
    logoAlt: card.media?.alt,
    name: card.name,
    network: card.network,
    optionCount: card.dimensions.reduce((total, dimension) => total + dimension.options.length, 0),
    regions: card.regions,
    searchText: [card.name, card.issuer, card.regions, card.supportedAssets, card.custody, card.network].join(" ").toLowerCase(),
    slug: card.slug,
  }));
  const catalogSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/cards#webpage`,
        url: `${SITE_URL}/cards`,
        name: "Crypto card index",
        description: "A global index of crypto card programs, fees, rewards, plans, and availability.",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${SITE_URL}/cards#card-list` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/cards#card-list`,
        name: "Crypto cards",
        numberOfItems: cards.length,
        itemListElement: cards.map((card, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: card.name,
          url: `${SITE_URL}/cards/${card.slug}`,
        })),
      },
    ],
  };

  return (
    <div className="shell page-stack catalog-page"><JsonLd data={catalogSchema} />
      <header className="editorial-header">
        <div><p className="kicker">Global card index</p><h1>{snapshot.cards.length} cards in one place.</h1></div>
        <p>Search by card, issuer, region, asset, funding model, or network.</p>
      </header>
      <CatalogExplorer cards={cards} initialNetwork={network} initialQuery={query} />
    </div>
  );
}
