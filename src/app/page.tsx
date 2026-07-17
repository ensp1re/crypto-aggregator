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
            <h1>Compare the card.<br /><em>Interrogate the claim.</em></h1>
            <p className="hero-lede">A global index of crypto cards, their real funding models, fees, rewards, regions, and the evidence behind every term.</p>
            <div className="button-row"><Link className="button primary" href="/cards">Explore 42 programs <ArrowRight aria-hidden="true" size={17} /></Link><Link className="button secondary" href="/analytics">Open market analytics</Link></div>
          </div>
          <aside className="hero-index" aria-label="Current research coverage">
            <header><span>Research ledger</span><span>17.07.26</span></header>
            <dl><div><dt>Programs discovered</dt><dd>42</dd></div><div><dt>Non-custodial labels</dt><dd>{nonCustodial}</dd></div><div><dt>Officially verified fields</dt><dd>0</dd></div><div><dt>Paid analytics imported</dt><dd>0</dd></div></dl>
            <p><CircleDot aria-hidden="true" size={14} /> Broad index live. Official verification in progress.</p>
          </aside>
        </div>
      </section>
      <section className="shell home-section">
        <header className="section-lead"><div><p className="kicker">Live discovery index</p><h2>Start broad. Verify before deciding.</h2></div><Link className="text-link" href="/cards">View all programs <ArrowUpRight aria-hidden="true" size={16} /></Link></header>
        <div className="featured-ledger">
          {featured.map((card) => <article key={card.id}><IssuerMark issuer={card.issuer} src={card.logo} alt={card.media?.alt} size={44} /><div><h3><Link href={`/cards/${card.slug}`}>{card.name}</Link></h3><p>{card.custody} / {card.network}</p></div><dl><div><dt>Reported reward</dt><dd>{maximumReward(card)}</dd></div><div><dt>Reported region</dt><dd>{card.regions}</dd></div></dl></article>)}
        </div>
      </section>
      <section className="ink-section">
        <div className="shell method-grid">
          <div><p className="kicker">The CardStats difference</p><h2>A database that shows its seams.</h2></div>
          <div className="method-points"><article><ScanSearch aria-hidden="true" /><h3>Every number has a source state</h3><p>Discovery, verified, conflicting, stale, and undisclosed are different facts. The interface never turns missing data into zero.</p></article><article><Database aria-hidden="true" /><h3>Analytics preserve the denominator</h3><p>Catalog distribution, onchain adoption, and product behaviour stay separate. Coverage never masquerades as market share.</p></article></div>
        </div>
      </section>
      <section className="shell home-section analytics-tease"><div><p className="kicker">Market question 01</p><h2>Which funding model is shaping the current card landscape?</h2><p>Twenty-six of 42 observed programs are labelled self-custody or non-custodial. The answer is useful, but the source taxonomy still needs verification.</p><Link className="button secondary" href="/analytics">Inspect the distribution</Link></div><div className="mini-bars" aria-label="Funding control distribution preview">{distribution("custody").map((item) => <div key={item.label}><span>{item.label}</span><i style={{ width: `${(item.value / 42) * 100}%` }} /><strong>{item.value}</strong></div>)}</div></section>
    </>
  );
}
