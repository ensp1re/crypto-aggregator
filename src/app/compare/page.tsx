import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IssuerMark } from "@/components/issuer-mark";
import { getDiscoveryCard, maximumReward } from "@/modules/catalog/discovery";

export const metadata: Metadata = { title: "Compare crypto cards", description: "Compare real crypto-card discovery observations without hiding verification gaps." };

const slugs = ["metamask-card", "etherfi-card", "gnosis-card"];
const rows = [
  ["Funding control", "custody"], ["Card model", "type"], ["Network", "network"], ["Reported regions", "regions"],
  ["Maximum reported reward", "cashbackMax"], ["Annual fee", "annualFee"], ["FX fee", "fxFee"],
  ["ATM limit", "atmLimit"], ["Qualification", "stakingRequired"], ["Supported assets", "supportedAssets"], ["KYC", "kyc"],
] as const;

export default function ComparePage() {
  const cards = slugs.map((slug) => getDiscoveryCard(slug)).filter((card): card is NonNullable<typeof card> => Boolean(card));
  return (
    <div className="shell page-stack compare-page">
      <header className="editorial-header"><div><p className="kicker">Side-by-side / discovery data</p><h1>Three self-directed cards, without a fake winner.</h1></div><p>Compare how each program is described, then confirm every consequential term with the issuer. Shared region and scenario logic will follow official verification.</p></header>
      <div className="compare-matrix" role="table" aria-label="Crypto card comparison">
        <div className="compare-header" role="row"><div role="columnheader">Decision factor</div>{cards.map((card) => <div role="columnheader" key={card.id}><IssuerMark issuer={card.issuer} src={card.logo} alt={card.media?.alt} size={42} /><span><strong>{card.name}</strong><small>{card.issuer}</small></span><Link href={`/cards/${card.slug}`} aria-label={`Open ${card.name} profile`}><ArrowUpRight aria-hidden="true" size={16} /></Link></div>)}</div>
        {rows.map(([label, key]) => <div className="compare-row" role="row" key={key}><div role="rowheader">{label}</div>{cards.map((card) => <div role="cell" data-card={card.name} key={card.id}><span className="mobile-card-label">{card.name}</span><strong>{key === "cashbackMax" ? maximumReward(card) : String(card[key])}</strong></div>)}</div>)}
      </div>
      <section className="method-strip"><p className="kicker">Why no ranking?</p><h2>Eligibility and verified economics come first.</h2><p>The source does not model regional legal offerings or consistently separate headline rewards from base rewards, caps, staking, and exclusions. Ranking this data would manufacture confidence, so CardStats does not.</p></section>
    </div>
  );
}
