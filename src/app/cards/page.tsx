import type { Metadata } from "next";
import { Search, SlidersHorizontal } from "lucide-react";
import { CardRow } from "@/components/card-row";
import { CustomSelect } from "@/components/custom-select";
import { filterDiscoveryCards, getDiscoverySnapshot } from "@/modules/catalog/discovery";

export const metadata: Metadata = { title: "Explore crypto cards", description: "Browse and compare 42 crypto-card programs by fees, rewards, funding model, and region." };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CardsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const value = (name: string) => typeof params[name] === "string" ? params[name] : undefined;
  const query = value("q") ?? "";
  const custody = value("custody") ?? "all";
  const network = value("network") ?? "all";
  const results = filterDiscoveryCards({ query, custody, network });
  const snapshot = getDiscoverySnapshot();

  return (
    <div className="shell page-stack catalog-page">
      <header className="editorial-header">
        <div><p className="kicker">Card index / updated 17.07.26</p><h1>Forty-two cards in one place.</h1></div>
        <p>Search by card, issuer, region, asset, funding model, or network.</p>
      </header>
      <form className="filter-bar" action="/cards" method="get">
        <label className="search-field"><span className="sr-only">Search cards</span><Search aria-hidden="true" size={18} /><input name="q" defaultValue={query} placeholder="Search card, issuer, region, asset" /></label>
        <CustomSelect label="Funding control" name="custody" defaultValue={custody} options={[{ value: "all", label: "All models" }, { value: "Custodial", label: "Custodial" }, { value: "Non-Custodial", label: "Non-Custodial" }, { value: "Self-Custody", label: "Self-Custody" }, { value: "Hybrid", label: "Hybrid" }]} />
        <CustomSelect label="Network" name="network" defaultValue={network} options={[{ value: "all", label: "All networks" }, { value: "Visa", label: "Visa" }, { value: "Mastercard", label: "Mastercard" }, { value: "Visa/Mastercard", label: "Visa/Mastercard" }]} />
        <button className="button primary" type="submit"><SlidersHorizontal aria-hidden="true" size={17} /> Apply</button>
      </form>
      <div className="result-line"><p><strong>{results.length}</strong> of {snapshot.cards.length} cards</p><p>Sorted alphabetically. Commercial status has no effect.</p></div>
      <section className="catalog-list" aria-label="Crypto cards">
        {results.length ? results.map((card) => <CardRow card={card} key={card.id} />) : <div className="empty-state"><h2>No matching card</h2><p>Clear filters or try an issuer, region, or asset name.</p></div>}
      </section>
    </div>
  );
}
