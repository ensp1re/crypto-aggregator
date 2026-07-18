import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, DatabaseZap } from "lucide-react";
import { DistributionChart } from "@/components/distribution-chart";
import { distribution, getDiscoverySnapshot, unavailable } from "@/modules/catalog/discovery";

export const metadata: Metadata = { title: "Crypto card market analytics", description: "Coverage-aware crypto-card infrastructure and funding analytics." };

export default async function AnalyticsPage() {
  const snapshot = await getDiscoverySnapshot();
  const total = snapshot.cards.length;
  const custody = distribution(snapshot.cards, "custody");
  const disclosedFunding = snapshot.cards.filter(({ custody: model }) => model !== unavailable).length;

  return (
    <div className="shell page-stack analytics-page">
      <header className="analytics-header"><p className="kicker">Market structure / {total} cards</p><h1>How is the current catalog structured?</h1><p><strong>{disclosedFunding} of {total}</strong> cards have a collected funding-model description. Source links remain available on researched card profiles.</p></header>
      <div className="analytics-controls"><span>Cards: {total}</span><span>Unit: card count</span><span>Method: current database observations</span></div>
      <DistributionChart title="Funding models" description="Broad working categories make unlike issuer language comparable without turning missing values into assumptions." data={custody} total={total} />
      <div className="analytics-split">
        <DistributionChart title="Payment networks" description="Program count, not spend or transaction share. Dual-network programs remain a separate category." data={distribution(snapshot.cards, "network")} total={total} />
        <DistributionChart title="Card models" description="Broad categories normalized from current catalog descriptions." data={distribution(snapshot.cards, "type")} total={total} />
      </div>
      <section className="locked-data">
        <DatabaseZap aria-hidden="true" size={28} />
        <div><p className="kicker">Adoption analytics</p><h2>Payment volume is not imported yet.</h2><p>PaymentScan offers volume, transaction, address, chain, currency, and network series through a paid API. The backend connector is ready, but CardStats will not display those series without an API key and explicit republication rights.</p></div>
        <div className="locked-links"><a href="https://paymentscan.xyz/methodology" target="_blank" rel="noreferrer">Read source method <ArrowUpRight aria-hidden="true" size={15} /></a><Link href="/cards">Explore program data</Link></div>
      </section>
      <section className="method-strip"><p className="kicker">Interpretation</p><h2>Coverage is not market share.</h2><p>Exact counts stay paired with the denominator. Nothing here measures cardholders, payment volume, safety, or product quality.</p></section>
    </div>
  );
}
