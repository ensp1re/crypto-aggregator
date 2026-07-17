import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, WalletCards } from "lucide-react";
import { IssuerMark } from "@/components/issuer-mark";
import { getDiscoveryCard, getDiscoverySnapshot, maximumReward } from "@/modules/catalog/discovery";
import { getOfficialObservations } from "@/modules/catalog/official-observations";

export function generateStaticParams() {
  return getDiscoverySnapshot().cards.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const card = getDiscoveryCard((await params).slug);
  return card ? { title: card.name, description: `Source-aware research profile for ${card.name} from ${card.issuer}.` } : {};
}

export default async function CardDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const card = getDiscoveryCard((await params).slug);
  if (!card) notFound();
  const officialObservations = getOfficialObservations(card.id);
  const facts = [
    ["Card model", card.type], ["Payment network", card.network], ["Funding control", card.custody],
    ["Reported regions", card.regions], ["Annual fee", card.annualFee], ["FX fee", card.fxFee],
    ["Maximum reported reward", maximumReward(card)], ["ATM limit", card.atmLimit],
    ["Qualification", card.stakingRequired], ["KYC", card.kyc],
  ];

  return (
    <div className="shell page-stack detail-page">
      <Link className="back-link" href="/cards"><ArrowLeft aria-hidden="true" size={16} /> All programs</Link>
      <header className="profile-header">
        <div className="profile-identity"><IssuerMark issuer={card.issuer} src={card.logo} alt={card.media?.alt} size={72} /><div><p className="kicker">{card.issuer} / discovery profile</p><h1>{card.name}</h1><p>{card.network} / {card.type} / {card.custody}</p></div></div>
        <a className="button primary" href={card.officialLink} rel="noreferrer" target="_blank">Confirm with issuer <ArrowUpRight aria-hidden="true" size={17} /></a>
      </header>
      {officialObservations.length > 0 ? <section className="fact-sheet official-evidence" aria-labelledby="official-evidence-title">
        <div className="section-title"><div><p className="kicker">Official evidence</p><h2 id="official-evidence-title">Observations awaiting independent review</h2></div><span>{officialObservations.length} observations</span></div>
        <dl>{officialObservations.map((observation) => <div key={observation.key}>
          <dt>{observation.label}</dt>
          <dd className="official-value">{observation.value}<small>Scope: {observation.scope}</small></dd>
          <dd className="fact-status"><a href={observation.sourceUrl} rel="noreferrer" target="_blank">Official source <ArrowUpRight aria-hidden="true" size={14} /></a></dd>
        </div>)}</dl>
        <p className="evidence-footnote">Collected from issuer-controlled sources on 17 July 2026. These observations remain review-pending and are not ranked or labeled verified.</p>
      </section> : null}
      <div className="detail-grid">
        <section className="fact-sheet" aria-labelledby="terms-title">
          <div className="section-title"><div><p className="kicker">Observed terms</p><h2 id="terms-title">What the discovery source reports</h2></div></div>
          <dl>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </section>
        <aside className="profile-aside">
          {card.media ? <section><Check aria-hidden="true" /><h2>Official issuer mark</h2><p>Observed on {card.media.observedAt}. The mark identifies the product but does not verify the reported terms.</p><a className="text-link" href={card.media.sourcePage} rel="noreferrer" target="_blank">View asset source <ArrowUpRight aria-hidden="true" size={16} /></a></section> : null}
          <section><WalletCards aria-hidden="true" /><h2>Assets and currencies</h2><p>{card.supportedAssets}</p><ul>{card.supportedCurrencies.map((currency) => <li key={currency}>{currency}</li>)}</ul></section>
          <section><Check aria-hidden="true" /><h2>Wallet support</h2><p>{card.mobilePay ? "Mobile wallet support reported" : "No mobile wallet support reported"}</p><p>{card.metal ? "Metal card reported" : "No metal card reported"}</p></section>
        </aside>
      </div>
      <section className="method-strip"><p className="kicker">Publication boundary</p><h2>Useful for discovery. Not enough for a decision.</h2><p>CardStats will promote each field only after matching it to a regional issuer page, fee schedule, agreement, or other authoritative source. Until then, this profile deliberately has no score or recommendation.</p></section>
    </div>
  );
}
