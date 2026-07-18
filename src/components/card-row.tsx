import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IssuerMark } from "./issuer-mark";
import { comparisonHref } from "@/modules/catalog/comparison";

export type CatalogCardSummary = {
  cashbackMax: string;
  custody: string;
  id: string;
  issuer: string;
  logo?: string;
  logoAlt?: string;
  name: string;
  network: string;
  optionCount: number;
  regions: string;
  searchText: string;
  slug: string;
};

export function CardRow({ card }: { card: CatalogCardSummary }) {
  return (
    <article className="catalog-row">
      <div className="catalog-identity">
        <IssuerMark issuer={card.issuer} src={card.logo} alt={card.logoAlt} />
        <div><h2><Link href={`/cards/${card.slug}`}>{card.name}</Link></h2><p>{card.issuer}{card.optionCount ? ` / ${card.optionCount} options` : ""}</p></div>
      </div>
      <dl className="catalog-facts">
        <div><dt>Funding model</dt><dd>{card.custody}</dd></div>
        <div><dt>Network</dt><dd>{card.network}</dd></div>
        <div><dt>Rewards</dt><dd>{card.cashbackMax}</dd></div>
        <div><dt>Regions</dt><dd>{card.regions}</dd></div>
      </dl>
      <div className="catalog-actions">
        <Link className="text-link" href={comparisonHref([card.slug])}>Compare</Link>
        <Link className="text-link" href={`/cards/${card.slug}`}>Open profile <ArrowUpRight aria-hidden="true" size={16} /></Link>
      </div>
    </article>
  );
}
