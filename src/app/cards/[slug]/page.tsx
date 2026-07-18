import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BadgePercent, Check, Gift, Plane, Smartphone, WalletCards } from "lucide-react";
import { IssuerMark } from "@/components/issuer-mark";
import { ComparePicker } from "@/components/compare-picker";
import { getCompareOptions } from "@/modules/catalog/comparison-server";
import { getDiscoveryCard, getDiscoverySnapshot } from "@/modules/catalog/discovery";
import { getOfficialObservations } from "@/modules/catalog/official-observations";
import {
  getCardFact,
  getProgramBenefits,
  getProgramDetails,
  getProgramName,
  getProgramPlan,
  type BenefitKind,
} from "@/modules/catalog/program-details";

export function generateStaticParams() {
  return getDiscoverySnapshot().cards.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const card = getDiscoveryCard((await params).slug);
  return card ? { title: getProgramName(card), description: `Card details, fees, rewards, plans, and benefits for ${getProgramName(card)}.` } : {};
}

export default async function CardDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ plan?: string | string[] }>;
}) {
  const card = getDiscoveryCard((await params).slug);
  if (!card) notFound();
  const requestedPlan = (await searchParams).plan;
  const selectedPlan = getProgramPlan(card.slug, Array.isArray(requestedPlan) ? requestedPlan[0] : requestedPlan);
  const details = getProgramDetails(card.slug);
  const name = getProgramName(card);
  const benefits = getProgramBenefits(card.slug, selectedPlan?.id);
  const officialObservations = getOfficialObservations(card.id);
  const compareOptions = getCompareOptions();
  const facts = [
    ["Card model", getCardFact(card, "type", selectedPlan?.id)],
    ["Payment network", getCardFact(card, "network", selectedPlan?.id)],
    ["Funding model", getCardFact(card, "custody", selectedPlan?.id)],
    ["Regions", getCardFact(card, "regions", selectedPlan?.id)],
    ["Annual fee", getCardFact(card, "annualFee", selectedPlan?.id)],
    ["FX fee", getCardFact(card, "fxFee", selectedPlan?.id)],
    ["Rewards", getCardFact(card, "cashbackMax", selectedPlan?.id)],
    ["ATM fees and limits", getCardFact(card, "atmLimit", selectedPlan?.id)],
    ["Requirements", getCardFact(card, "stakingRequired", selectedPlan?.id)],
    ["KYC", getCardFact(card, "kyc", selectedPlan?.id)],
  ];

  return (
    <div className="shell page-stack detail-page">
      <Link className="back-link" href="/cards"><ArrowLeft aria-hidden="true" size={16} /> All cards</Link>
      <header className="profile-header">
        <div className="profile-identity"><IssuerMark issuer={card.issuer} src={card.logo} alt={card.media?.alt} size={72} /><div><p className="kicker">{card.issuer} / card profile</p><h1>{name}</h1><p>{card.network} / {getCardFact(card, "type", selectedPlan?.id)} / {card.custody}</p></div></div>
        <div className="profile-actions">
          <a className="button primary" href={details?.officialUrl ?? card.officialLink} rel="noreferrer" target="_blank">Visit website <ArrowUpRight aria-hidden="true" size={17} /></a>
          <ComparePicker cards={compareOptions} anchorSlug={card.slug} initialSelected={[card.slug]} initialPlans={selectedPlan ? { [card.slug]: selectedPlan.id } : {}} buttonLabel="Compare" />
        </div>
      </header>
      {details?.plans?.length ? <section className="plan-selector" aria-labelledby="plan-selector-title">
        <div><p className="kicker">Card options</p><h2 id="plan-selector-title">Choose a plan</h2></div>
        <div className="plan-tabs" aria-label={`${name} plans`}>
          {details.plans.map((plan) => <Link key={plan.id} href={`/cards/${card.slug}?plan=${plan.id}`} aria-current={selectedPlan?.id === plan.id ? "page" : undefined}>{plan.name}</Link>)}
        </div>
        <p>{selectedPlan?.summary}</p>
      </section> : null}
      {benefits.length > 0 || details?.planNote ? <section className="benefits-section" aria-labelledby="benefits-title">
        <div className="section-title"><div><p className="kicker">Included value</p><h2 id="benefits-title">Benefits &amp; perks{selectedPlan ? ` / ${selectedPlan.name}` : ""}</h2></div>{details ? <a className="text-link" href={details.sourceUrl} rel="noreferrer" target="_blank">View current terms <ArrowUpRight aria-hidden="true" size={16} /></a> : null}</div>
        {details?.planNote ? <p className="plan-note">{details.planNote}</p> : null}
        <div className="benefit-list">{benefits.map((benefit) => <article key={`${benefit.kind}-${benefit.title}`}>
          {benefitIcon(benefit.kind)}
          <div><p>{benefit.kind}</p><h3>{benefit.title}{benefit.status === "coming-soon" ? <span>Coming soon</span> : null}</h3><p>{benefit.description}</p></div>
        </article>)}</div>
      </section> : null}
      {officialObservations.length > 0 ? <section className="fact-sheet official-evidence" aria-labelledby="official-evidence-title">
        <div className="section-title"><div><p className="kicker">From the issuer</p><h2 id="official-evidence-title">Latest card details</h2></div><span>{officialObservations.length} details</span></div>
        <dl>{officialObservations.map((observation) => <div key={observation.key}>
          <dt>{observation.label}</dt>
          <dd className="official-value">{observation.value}<small>{observation.scope}</small></dd>
          <dd className="fact-status"><a href={observation.sourceUrl} rel="noreferrer" target="_blank">View source <ArrowUpRight aria-hidden="true" size={14} /></a></dd>
        </div>)}</dl>
        <p className="evidence-footnote">Added from issuer pages on 17 July 2026. Card terms can change.</p>
      </section> : null}
      <div className="detail-grid">
        <section className="fact-sheet" aria-labelledby="terms-title">
          <div className="section-title"><div><p className="kicker">At a glance</p><h2 id="terms-title">Card details</h2></div></div>
          <dl>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </section>
        <aside className="profile-aside">
          {card.media ? <section><Check aria-hidden="true" /><h2>Issuer logo</h2><p>Logo added on {card.media.observedAt}.</p><a className="text-link" href={card.media.sourcePage} rel="noreferrer" target="_blank">View logo source <ArrowUpRight aria-hidden="true" size={16} /></a></section> : null}
          <section><WalletCards aria-hidden="true" /><h2>Assets and currencies</h2><p>{getCardFact(card, "supportedAssets", selectedPlan?.id)}</p><ul>{card.supportedCurrencies.map((currency) => <li key={currency}>{currency}</li>)}</ul></section>
          <section><Check aria-hidden="true" /><h2>Card format</h2><p>{card.mobilePay ? "Mobile wallet support available" : "Mobile wallet details unavailable"}</p><p>{selectedPlan?.facts.type ?? (card.metal ? "Metal card available" : "Physical card details unavailable")}</p></section>
        </aside>
      </div>
    </div>
  );
}

function benefitIcon(kind: BenefitKind) {
  if (kind === "travel") return <Plane aria-hidden="true" />;
  if (kind === "subscriptions") return <BadgePercent aria-hidden="true" />;
  if (kind === "wallet") return <Smartphone aria-hidden="true" />;
  return <Gift aria-hidden="true" />;
}
