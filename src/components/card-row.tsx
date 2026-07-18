import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IssuerMark } from "./issuer-mark";
import { maximumReward, type DiscoveryCard } from "@/modules/catalog/discovery";
import { comparisonHref } from "@/modules/catalog/comparison";

export function CardRow({ card }: { card: DiscoveryCard }) {
  return (
    <article className="catalog-row">
      <div className="catalog-identity">
        <IssuerMark issuer={card.issuer} src={card.logo} alt={card.media?.alt} />
        <div><h2><Link href={`/cards/${card.slug}`}>{card.name}</Link></h2><p>{card.issuer}</p></div>
      </div>
      <dl className="catalog-facts">
        <div><dt>Funding model</dt><dd>{card.custody}</dd></div>
        <div><dt>Network</dt><dd>{card.network}</dd></div>
        <div><dt>Rewards</dt><dd>{maximumReward(card)}</dd></div>
        <div><dt>Regions</dt><dd>{card.regions}</dd></div>
      </dl>
      <div className="catalog-actions">
        <Link className="text-link" href={comparisonHref([card.slug])}>Compare</Link>
        <Link className="text-link" href={`/cards/${card.slug}`}>Open profile <ArrowUpRight aria-hidden="true" size={16} /></Link>
      </div>
    </article>
  );
}
