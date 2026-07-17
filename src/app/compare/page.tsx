import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeftRight, MapPin } from "lucide-react";
import { ClaimValue } from "@/components/claim-view";
import { getAtlasProgram } from "@/modules/catalog/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compare Atlas offerings",
  description: "Compare two scoped synthetic crypto-card offerings without hiding unknown values.",
};

const rows = [
  ["ELIGIBILITY", "Residency eligibility", null],
  ["FUNDING_MODEL", "Funding model", null],
  ["MONTHLY_FEE", "Monthly fee", "Plus"],
  ["FX_FEE", "Foreign exchange fee", null],
  ["ATM_FEE", "ATM fee", null],
  ["REWARD_RATE", "Reward rate", "Plus"],
  ["REWARD_CAP", "Reward cap", "Plus"],
  ["SPEND_LIMIT", "Monthly spend limit", null],
] as const;

export default async function ComparePage() {
  const program = await getAtlasProgram();
  const offerings = program.offerings.map((offering) => ({
    ...offering,
    selectedPlan: offering.plans.find((plan) => plan.name === "Plus")!,
  }));

  const findClaim = (offering: (typeof offerings)[number], field: string, planName: string | null) => {
    const planId = planName ? offering.selectedPlan.id : null;
    return offering.publishedClaims.find((claim) => claim.field === field && claim.planId === planId);
  };

  return (
    <div className="shell page-stack">
      <header className="page-header compare-title">
        <div><p className="eyebrow">Scoped comparison</p><h1>Germany Plus vs France Plus</h1><p className="lede">Shared scenario: resident of the offering country, EUR 2,000 monthly spend, no benefit valuation.</p></div>
        <ArrowLeftRight aria-hidden="true" size={38} />
      </header>
      <aside className="notice warning" aria-label="Comparison limitation"><AlertTriangle aria-hidden="true" /><p>These fictional offerings are not alternatives for one person: residency differs. The comparison deliberately exposes that mismatch instead of silently ranking them.</p></aside>

      <section aria-labelledby="comparison-heading">
        <h2 className="sr-only" id="comparison-heading">Offering comparison</h2>
        <div className="comparison" role="table" aria-label="Atlas Plus offering comparison">
          <div className="comparison-head" role="row">
            <div role="columnheader">Decision factor</div>
            {offerings.map((offering) => <div role="columnheader" key={offering.id}><span className="scope-label"><MapPin aria-hidden="true" size={16} /> {offering.countryCode}</span><strong>{offering.label}</strong><span>{offering.selectedPlan.name} · {offering.issuer.name}</span></div>)}
          </div>
          {rows.map(([field, label, planName]) => (
            <div className="comparison-row" role="row" key={field}>
              <div className="comparison-label" role="rowheader">{label}</div>
              {offerings.map((offering) => <div role="cell" data-label={`${offering.countryCode} ${label}`} key={offering.id}><ClaimValue compact claim={findClaim(offering, field, planName)} /></div>)}
            </div>
          ))}
        </div>
      </section>
      <section className="method-note"><h2>Decision</h2><p>No winner is declared because residency is a hard eligibility condition. For an eligible resident, the French fixture has the lower Plus subscription and FX fee; the German fixture has the higher advertised reward and cap. France’s ATM fee remains explicitly undisclosed.</p><Link href="/programs/atlas-card">Inspect all evidence on the program page</Link></section>
    </div>
  );
}
