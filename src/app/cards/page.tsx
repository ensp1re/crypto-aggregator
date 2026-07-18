import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { getDiscoverySnapshot, maximumReward } from "@/modules/catalog/discovery";

export const metadata: Metadata = { title: "Explore crypto cards", description: "Browse and compare crypto-card programs by fees, rewards, funding model, and region." };

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

  return (
    <div className="shell page-stack catalog-page">
      <header className="editorial-header">
        <div><p className="kicker">Global card index</p><h1>{snapshot.cards.length} cards in one place.</h1></div>
        <p>Search by card, issuer, region, asset, funding model, or network.</p>
      </header>
      <CatalogExplorer cards={cards} initialNetwork={network} initialQuery={query} />
    </div>
  );
}
