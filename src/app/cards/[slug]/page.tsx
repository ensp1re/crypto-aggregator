import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BadgePercent, Check, Gift, Plane, Smartphone, WalletCards } from "lucide-react";
import { IssuerMark } from "@/components/issuer-mark";
import { ComparePicker } from "@/components/compare-picker";
import { getCompareOptions } from "@/modules/catalog/comparison-server";
import { getDiscoveryCard } from "@/modules/catalog/discovery";
import {
  getCardFact,
  getCardFactSource,
  getProgramBenefits,
  getProgramDetails,
  getProgramName,
  getSelectedOptions,
  profileHref,
  profileSelections,
  selectionKey,
  type BenefitKind,
} from "@/modules/catalog/program-details";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const card = await getDiscoveryCard((await params).slug);
  return card ? { title: getProgramName(card), description: `Card details, fees, rewards, plans, and benefits for ${getProgramName(card)}.` } : {};
}

export default async function CardDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ plans?: string | string[] }>;
}) {
  const card = await getDiscoveryCard((await params).slug);
  if (!card) notFound();
  const selections = profileSelections(card, (await searchParams).plans);
  const selectedOptions = getSelectedOptions(card, selections);
  const details = getProgramDetails(card);
  const name = getProgramName(card);
  const benefits = getProgramBenefits(card, selections);
  const officialObservations = card.observations;
  const compareOptions = await getCompareOptions();
  const facts = ([
    ["Card model", "type"], ["Payment network", "network"], ["Funding model", "custody"], ["Funding or top-up fee", "fundingFee"], ["Regions", "regions"], ["Annual fee", "annualFee"], ["FX fee", "fxFee"], ["Rewards", "cashbackMax"], ["ATM fees and limits", "atmLimit"], ["Requirements", "stakingRequired"], ["KYC", "kyc"],
  ] as const).map(([label, key]) => ({ label, key, value: getCardFact(card, key, selections), source: getCardFactSource(card, key, selections) }));

  return (
    <div className="shell page-stack detail-page">
      <Link className="back-link" href="/cards"><ArrowLeft aria-hidden="true" size={16} /> All cards</Link>
      <header className="profile-header">
        <div className="profile-identity"><IssuerMark issuer={card.issuer} src={card.logo} alt={card.media?.alt} size={72} /><div><p className="kicker">{card.issuer} / card profile</p><h1>{name}</h1><p>{getCardFact(card, "network", selections)} / {getCardFact(card, "type", selections)}</p></div></div>
        <div className="profile-actions">
          {details?.officialUrl ? <a className="button primary" href={details.officialUrl} rel="noreferrer" target="_blank">Visit website <ArrowUpRight aria-hidden="true" size={17} /></a> : <span className="button unavailable" aria-disabled="true">Website unresolved</span>}
          <ComparePicker cards={compareOptions} anchorSlug={card.slug} initialSelected={[card.slug]} initialPlans={selections} buttonLabel="Compare" />
        </div>
      </header>
      {card.dimensions.length ? <section className="plan-selector" aria-labelledby="plan-selector-title">
        <div><p className="kicker">Card options</p><h2 id="plan-selector-title">Choose the options you want</h2></div>
        <div className="plan-dimensions">
          {card.dimensions.map((dimension) => <div className="plan-dimension" key={dimension.id}>
            <h3>{dimension.label}</h3>
            <div className="plan-tabs" aria-label={`${name} ${dimension.label}`}>
              {dimension.options.map((option) => <Link
                key={option.id}
                href={profileHref(card, { ...selections, [selectionKey(card.slug, dimension.id)]: option.id })}
                aria-current={selections[selectionKey(card.slug, dimension.id)] === option.id ? "page" : undefined}
              >{option.name}</Link>)}
            </div>
          </div>)}
        </div>
        {selectedOptions.map(({ dimension, option }) => <p key={dimension.id}><strong>{dimension.label}:</strong> {option.summary}</p>)}
      </section> : null}
      {benefits.length > 0 ? <section className="benefits-section" aria-labelledby="benefits-title">
        <div className="section-title"><div><p className="kicker">Included value</p><h2 id="benefits-title">Benefits &amp; perks{selectedOptions.length ? ` / ${selectedOptions.map(({ option }) => option.name).join(" + ")}` : ""}</h2></div>{details?.officialUrl ? <a className="text-link" href={details.officialUrl} rel="noreferrer" target="_blank">View current terms <ArrowUpRight aria-hidden="true" size={16} /></a> : null}</div>
        <div className="benefit-list">{benefits.map((benefit) => <article key={`${benefit.kind}-${benefit.title}`}>
          {benefitIcon(benefit.kind)}
          <div><p>{benefit.kind}</p><h3>{benefit.title}{benefit.status ? <span>{benefit.status === "coming-soon" ? "Coming soon" : benefit.validUntil ? `Through ${benefit.validUntil}` : "Time-limited"}</span> : null}</h3><p>{benefit.description}</p></div>
        </article>)}</div>
      </section> : null}
      {officialObservations.length > 0 ? <section className="fact-sheet official-evidence" aria-labelledby="official-evidence-title">
        <div className="section-title"><div><p className="kicker">From the issuer</p><h2 id="official-evidence-title">Latest card details</h2></div><span>{officialObservations.length} details</span></div>
        <dl>{officialObservations.map((observation) => <div key={observation.key}>
          <dt>{observation.label}</dt>
          <dd className="official-value">{observation.value}<small>{observation.scope}</small></dd>
          <dd className="fact-status"><a href={observation.sourceUrl} rel="noreferrer" target="_blank">View source <ArrowUpRight aria-hidden="true" size={14} /></a></dd>
        </div>)}</dl>
        <p className="evidence-footnote">Direct links open the current official source for each detail.</p>
      </section> : null}
      <div className="detail-grid">
        <section className="fact-sheet" aria-labelledby="terms-title">
          <div className="section-title"><div><p className="kicker">At a glance</p><h2 id="terms-title">Card details</h2></div></div>
          <dl>{facts.map(({ label, value, source }) => <div key={label}><dt>{label}</dt><dd>{value}{source === "catalog-lead" ? <small className="fact-origin">Provisional catalog data</small> : null}</dd></div>)}</dl>
        </section>
        <aside className="profile-aside">
          {card.media ? <section><Check aria-hidden="true" /><h2>Issuer logo</h2><p>Logo added on {card.media.observedAt}.</p><a className="text-link" href={card.media.sourcePage} rel="noreferrer" target="_blank">View logo source <ArrowUpRight aria-hidden="true" size={16} /></a></section> : null}
          <section><WalletCards aria-hidden="true" /><h2>Assets and currencies</h2><p>{getCardFact(card, "supportedAssets", selections)}</p>{card.supportedCurrencies.length ? <ul>{card.supportedCurrencies.map((currency) => <li key={currency}>{currency}</li>)}</ul> : null}</section>
          <section><Check aria-hidden="true" /><h2>Card format</h2><p>{card.mobilePay ? "Mobile wallet support available" : "Mobile wallet support not documented"}</p><p>{getCardFact(card, "type", selections)}</p></section>
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
