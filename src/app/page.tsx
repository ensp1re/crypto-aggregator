import Link from "next/link";
import { ArrowRight, ArrowUpRight, CircleDot, Database, ScanSearch } from "lucide-react";
import { IssuerMark } from "@/components/issuer-mark";
import { distribution, getDiscoverySnapshot, maximumReward } from "@/modules/catalog/discovery";

export default async function HomePage() {
  const snapshot = await getDiscoverySnapshot();
  const featured = ["metamask-card", "bybit-card", "gnosis-card", "ready-card"]
    .map((slug) => snapshot.cards.find((card) => card.slug === slug))
    .filter((card): card is NonNullable<typeof card> => Boolean(card));
  const researched = snapshot.cards.filter(({ verification }) => verification === "official-research").length;

  return (
    <>
      <section className="home-hero">
        <div className="shell hero-layout">
          <div className="hero-copy">
            <p className="kicker">Independent crypto-card intelligence</p>
            <h1>Compare the card.<br /><em>Choose the right plan.</em></h1>
            <p className="hero-lede">A global index of crypto cards, funding models, fees, rewards, plans, and benefits.</p>
            <div className="button-row"><Link className="button primary" href="/cards">Explore {snapshot.cards.length} cards <ArrowRight aria-hidden="true" size={17} /></Link><Link className="button secondary" href="/analytics">Open market analytics</Link></div>
          </div>
          <aside className="hero-index" aria-label="Current research coverage">
            <header><span>Card index</span><span>17.07.26</span></header>
            <dl><div><dt>Cards indexed</dt><dd>{snapshot.cards.length}</dd></div><div><dt>Official sources collected</dt><dd>{researched}</dd></div><div><dt>Tier options structured</dt><dd>{snapshot.cards.flatMap(({ dimensions }) => dimensions.flatMap(({ options }) => options)).length}</dd></div><div><dt>Comparison slots</dt><dd>4</dd></div></dl>
            <p><CircleDot aria-hidden="true" size={14} /> Catalog data loads from PostgreSQL.</p>
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
      <section className="shell home-section analytics-tease"><div><p className="kicker">Catalog coverage</p><h2>Which payment networks appear across the card index?</h2><p>Working categories combine issuer evidence with clearly provisional catalog leads. Counts measure programs, not market share.</p><Link className="button secondary" href="/analytics">Inspect the distribution</Link></div><div className="mini-bars" aria-label="Payment network distribution preview">{distribution(snapshot.cards, "network").slice(0, 6).map((item) => <div key={item.label}><span>{item.label}</span><i style={{ width: `${(item.value / snapshot.cards.length) * 100}%` }} /><strong>{item.value}</strong></div>)}</div></section>
    </>
  );
}
