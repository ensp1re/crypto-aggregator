import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BadgePercent, Check, Gift, Plane, Smartphone, WalletCards } from "lucide-react";
import { IssuerMark } from "@/components/issuer-mark";
import { ComparePicker } from "@/components/compare-picker";
import { JsonLd } from "@/components/json-ld";
import { ProfilePlanSelector } from "@/components/profile-plan-selector";
import { SITE_URL, absoluteUrl, compactDescription, pageMetadata } from "@/lib/seo";
import { getCompareOptions } from "@/modules/catalog/comparison-server";
import { getDiscoveryCard } from "@/modules/catalog/discovery";
import {
  getCardFact,
  getProgramBenefits,
  getProgramDetails,
  getProgramName,
  getSelectedOptions,
  profileSelections,
  type BenefitKind,
} from "@/modules/catalog/program-details";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const card = await getDiscoveryCard((await params).slug);
  if (!card) return pageMetadata({ title: "Card not found", description: "This crypto card profile is unavailable.", path: "/cards", index: false });
  const name = getProgramName(card);
  const description = compactDescription(`Compare ${name} fees, rewards, plans, funding model, and benefits. ${card.network}; availability: ${card.regions}.`);
  return pageMetadata({
    title: `${name}: Fees, Rewards, Tiers & Benefits`,
    description,
    path: `/cards/${card.slug}`,
    index: card.verification === "official-research",
  });
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
  ] as const).map(([label, key]) => ({ label, value: getCardFact(card, key, selections) }));
  const cardUrl = `${SITE_URL}/cards/${card.slug}`;
  const cardDescription = compactDescription(`${name} is a ${getCardFact(card, "network", selections)} crypto card available in ${getCardFact(card, "regions", selections)}. Compare its fees, rewards, funding model, plans, and benefits.`);
  const profileSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${cardUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Crypto cards", item: `${SITE_URL}/cards` },
          { "@type": "ListItem", position: 3, name, item: cardUrl },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${cardUrl}#webpage`,
        url: cardUrl,
        name: `${name} card profile`,
        description: cardDescription,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${cardUrl}#breadcrumb` },
        mainEntity: { "@id": `${cardUrl}#card` },
        inLanguage: "en",
      },
      {
        "@type": "FinancialProduct",
        "@id": `${cardUrl}#card`,
        name,
        url: cardUrl,
        description: cardDescription,
        category: "Crypto payment card",
        provider: { "@type": "Organization", name: card.issuer },
        areaServed: card.regions,
        feesAndCommissionsSpecification: `Annual fee: ${getCardFact(card, "annualFee", selections)}; FX fee: ${getCardFact(card, "fxFee", selections)}; funding or top-up fee: ${getCardFact(card, "fundingFee", selections)}.`,
        ...(card.logo ? { image: absoluteUrl(card.logo) } : {}),
        ...(details?.officialUrl ? { sameAs: details.officialUrl } : {}),
      },
    ],
  };

  return (
    <div className="shell page-stack detail-page"><JsonLd data={profileSchema} />
      <Link className="back-link" href="/cards"><ArrowLeft aria-hidden="true" size={16} /> All cards</Link>
      <header className="profile-header">
        <div className="profile-identity"><IssuerMark issuer={card.issuer} src={card.logo} alt={card.media?.alt} size={72} /><div><p className="kicker">{card.issuer} / card profile</p><h1>{name}</h1><p>{getCardFact(card, "network", selections)} / {getCardFact(card, "type", selections)}</p></div></div>
        <div className="profile-actions">
          {details?.officialUrl ? <a className="button primary" href={details.officialUrl} rel="noreferrer" target="_blank">Visit website <ArrowUpRight aria-hidden="true" size={17} /></a> : <span className="button unavailable" aria-disabled="true">Website unresolved</span>}
          <ComparePicker cards={compareOptions} anchorSlug={card.slug} initialSelected={[card.slug]} initialPlans={selections} buttonLabel="Compare" />
        </div>
      </header>
      {card.dimensions.length ? <ProfilePlanSelector cardName={name} cardSlug={card.slug} dimensions={card.dimensions.map((dimension) => ({ id: dimension.id, label: dimension.label, options: dimension.options.map((option) => ({ id: option.id, name: option.name, summary: option.summary })) }))} key={JSON.stringify(selections)} selected={Object.fromEntries(card.dimensions.map((dimension) => [dimension.id, selections[`${card.slug}.${dimension.id}`] ?? dimension.options[0]?.id ?? ""]))} /> : null}
      <div className="detail-grid">
        <section className="fact-sheet" aria-labelledby="terms-title">
          <div className="section-title"><div><p className="kicker">At a glance</p><h2 id="terms-title">Card details</h2></div></div>
          <dl>{facts.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </section>
        <aside className="profile-aside">
          <section><WalletCards aria-hidden="true" /><h2>Assets and currencies</h2><p>{getCardFact(card, "supportedAssets", selections)}</p>{card.supportedCurrencies.length ? <ul>{card.supportedCurrencies.map((currency) => <li key={currency}>{currency}</li>)}</ul> : null}</section>
          <section><Check aria-hidden="true" /><h2>Card format</h2><p>{card.mobilePay ? "Mobile wallet support available" : "Mobile wallet support not documented"}</p><p>{getCardFact(card, "type", selections)}</p></section>
        </aside>
      </div>
      {benefits.length > 0 ? <section className="benefits-section" aria-labelledby="benefits-title">
        <div className="section-title"><div><p className="kicker">Included value</p><h2 id="benefits-title">Benefits &amp; perks{selectedOptions.length ? ` / ${selectedOptions.map(({ option }) => option.name).join(" + ")}` : ""}</h2></div>{details?.officialUrl ? <a className="text-link" href={details.officialUrl} rel="noreferrer" target="_blank">View current terms <ArrowUpRight aria-hidden="true" size={16} /></a> : null}</div>
        <div className="benefit-list">{benefits.map((benefit) => <article key={`${benefit.kind}-${benefit.title}`}>
          {benefitIcon(benefit.kind)}
          <div><p>{benefit.kind}</p><h3>{benefit.title}{benefit.status ? <span>{benefit.status === "coming-soon" ? "Coming soon" : benefit.validUntil ? `Through ${benefit.validUntil}` : "Time-limited"}</span> : null}</h3><p>{benefit.description}</p></div>
        </article>)}</div>
      </section> : null}
      {officialObservations.length > 0 ? <details className="source-ledger">
        <summary><span><small>Issuer sources</small><strong>Review {officialObservations.length} sourced details</strong></span><span>Show sources</span></summary>
        <section className="fact-sheet official-evidence" aria-labelledby="official-evidence-title">
          <div className="section-title"><div><p className="kicker">From the issuer</p><h2 id="official-evidence-title">Latest card details</h2></div></div>
          <dl>{officialObservations.map((observation) => <div key={observation.key}>
            <dt>{observation.label}</dt>
            <dd className="official-value">{observation.value}<small>{observation.scope}</small></dd>
            <dd className="fact-status"><a href={observation.sourceUrl} rel="noreferrer" target="_blank">View source <ArrowUpRight aria-hidden="true" size={14} /></a></dd>
          </div>)}</dl>
          <p className="evidence-footnote">Direct links open the current official source for each detail.</p>
        </section>
      </details> : null}
    </div>
  );
}

function benefitIcon(kind: BenefitKind) {
  if (kind === "travel") return <Plane aria-hidden="true" />;
  if (kind === "subscriptions") return <BadgePercent aria-hidden="true" />;
  if (kind === "wallet") return <Smartphone aria-hidden="true" />;
  return <Gift aria-hidden="true" />;
}
