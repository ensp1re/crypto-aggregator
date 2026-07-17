import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, DatabaseZap } from "lucide-react";
import { DistributionChart } from "@/components/distribution-chart";
import { distribution, getDiscoverySnapshot } from "@/modules/catalog/discovery";

export const metadata: Metadata = { title: "Crypto card market analytics", description: "Coverage-aware crypto-card infrastructure and funding analytics." };

export default function AnalyticsPage() {
  const snapshot = getDiscoverySnapshot();
  const total = snapshot.cards.length;
  const custody = distribution("custody");
  const selfControlled = custody.filter((item) => item.label === "Self-Custody" || item.label === "Non-Custodial").reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="shell page-stack analytics-page">
      <header className="analytics-header"><p className="kicker">Market structure / discovery coverage</p><h1>How much of the observed crypto-card market keeps users in control?</h1><p><strong>{selfControlled} of {total}</strong> discovered programs are labelled self-custody or non-custodial by the source. This describes catalog labels, not verified legal custody or transaction volume.</p></header>
      <div className="analytics-controls"><span>Observation: 17 Jul 2026</span><span>Universe: 42 discovered programs</span><span>Unit: program count</span><span>Method: source labels</span></div>
      <DistributionChart title="Funding control labels" description="Program count by source-reported custody label. Self-custody and non-custodial remain separate because the source does not define equivalence." data={custody} total={total} />
      <div className="analytics-split">
        <DistributionChart title="Payment networks" description="Program count, not spend or transaction share. Dual-network programs are not split." data={distribution("network")} total={total} />
        <DistributionChart title="Card models" description="Source-reported debit, prepaid, or credit label. Regional variants may differ." data={distribution("type")} total={total} />
      </div>
      <section className="locked-data">
        <DatabaseZap aria-hidden="true" size={28} />
        <div><p className="kicker">Adoption analytics</p><h2>Payment volume is not imported yet.</h2><p>PaymentScan offers volume, transaction, address, chain, currency, and network series through a paid API. The backend connector is ready, but CardStats will not display those series without an API key and explicit republication rights.</p></div>
        <div className="locked-links"><a href="https://paymentscan.xyz/methodology" target="_blank" rel="noreferrer">Read source method <ArrowUpRight aria-hidden="true" size={15} /></a><Link href="/cards">Explore program data</Link></div>
      </section>
      <section className="method-strip"><p className="kicker">Interpretation</p><h2>Coverage is not market share.</h2><p>This universe was discovered through one public index. It may omit programs, combine regional offerings, or contain stale labels. Exact counts stay paired with the denominator and source date; nothing here measures users, safety, or quality.</p></section>
    </div>
  );
}
