import Link from "next/link";
import { ArrowRight, ArrowUpRight, CircleDot, Database, ScanSearch } from "lucide-react";
import { IssuerMark } from "@/components/issuer-mark";
import { distribution, getDiscoverySnapshot, maximumReward } from "@/modules/catalog/discovery";

export default function HomePage() {
  const snapshot = getDiscoverySnapshot();
  const featured = ["metamask-card", "etherfi-card", "gnosis-card", "coinbase-card"]
    .map((slug) => snapshot.cards.find((card) => card.slug === slug))
    .filter((card): card is NonNullable<typeof card> => Boolean(card));
  const nonCustodial = distribution("custody").find((item) => item.label === "Non-Custodial")?.value ?? 0;

  return (
    <>
      <section className="home-hero">
        <div className="shell hero-layout">
          <div className="hero-copy">
            <p className="kicker">Independent crypto-card intelligence</p>
            <h1>Compare the card.<br /><em>Choose the right plan.</em></h1>
            <p className="hero-lede">A global index of crypto cards, funding models, fees, rewards, plans, and benefits.</p>
            <div className="button-row"><Link className="button primary" href="/cards">Explore 42 cards <ArrowRight aria-hidden="true" size={17} /></Link><Link className="button secondary" href="/analytics">Open market analytics</Link></div>
          </div>
          <aside className="hero-index" aria-label="Current research coverage">
            <header><span>Card index</span><span>17.07.26</span></header>
            <dl><div><dt>Cards indexed</dt><dd>42</dd></div><div><dt>Non-custodial cards</dt><dd>{nonCustodial}</dd></div><div><dt>Card profiles</dt><dd>42</dd></div><div><dt>Comparison slots</dt><dd>4</dd></div></dl>
            <p><CircleDot aria-hidden="true" size={14} /> Card index updated 17 July 2026.</p>
          </aside>
        </div>
      </section>
      <section className="shell home-section">
        <header className="section-lead"><div><p className="kicker">Card index</p><h2>Start with the cards people use.</h2></div><Link className="text-link" href="/cards">View all cards <ArrowUpRight aria-hidden="true" size={16} /></Link></header>
        <div className="featured-ledger">
          {featured.map((card) => <article key={card.id}><IssuerMark issuer={card.issuer} src={card.logo} alt={card.media?.alt} size={44} /><div><h3><Link href={`/cards/${card.slug}`}>{card.name}</Link></h3><p>{card.custody} / {card.network}</p></div><dl><div><dt>Rewards</dt><dd>{maximumReward(card)}</dd></div><div><dt>Regions</dt><dd>{card.regions}</dd></div></dl></article>)}
        </div>
      </section>
      <section className="ink-section">
        <div className="shell method-grid">
          <div><p className="kicker">Built for comparison</p><h2>Cards, plans, and perks belong together.</h2></div>
          <div className="method-points"><article><ScanSearch aria-hidden="true" /><h3>One card, every plan</h3><p>Lite, Metal, and membership tiers stay inside one card profile instead of becoming duplicate catalog entries.</p></article><article><Database aria-hidden="true" /><h3>Benefits next to costs</h3><p>Travel rates, subscription refunds, partner offers, fees, and rewards can be compared in the same view.</p></article></div>
        </div>
      </section>
      <section className="shell home-section analytics-tease"><div><p className="kicker">Market question 01</p><h2>Which funding model is shaping the current card landscape?</h2><p>Twenty-six of 42 cards are listed as self-custody or non-custodial.</p><Link className="button secondary" href="/analytics">Inspect the distribution</Link></div><div className="mini-bars" aria-label="Funding control distribution preview">{distribution("custody").map((item) => <div key={item.label}><span>{item.label}</span><i style={{ width: `${(item.value / 42) * 100}%` }} /><strong>{item.value}</strong></div>)}</div></section>
    </>
  );
}
