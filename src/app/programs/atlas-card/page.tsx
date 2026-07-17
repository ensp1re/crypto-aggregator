import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CalendarClock, CreditCard, Landmark, MapPin } from "lucide-react";
import { ClaimValue } from "@/components/claim-view";
import { getAtlasProgram } from "@/modules/catalog/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Atlas Card synthetic program",
  description: "A license-safe CardStats program fixture with two regional offerings and evidence-backed terms.",
};

const fieldLabels = {
  ELIGIBILITY: "Residency eligibility",
  CARD_TYPE: "Card type",
  FUNDING_MODEL: "How funding works",
  FX_FEE: "Foreign exchange fee",
  ATM_FEE: "ATM fee",
  SPEND_LIMIT: "Monthly spend limit",
} as const;

export default async function AtlasProgramPage() {
  const program = await getAtlasProgram();

  return (
    <div className="shell page-stack">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Atlas Card</span></nav>
      <header className="page-header">
        <div>
          <p className="eyebrow">Synthetic program fixture</p>
          <h1>{program.name}</h1>
          <p className="lede">One consumer program, modeled without flattening its German and French legal offerings.</p>
        </div>
        <Link className="button primary" href="/compare">Compare offerings <ArrowRight aria-hidden="true" size={18} /></Link>
      </header>
      <aside className="notice" aria-label="Fixture limitation"><CalendarClock aria-hidden="true" /><p><strong>Research cutoff: 12 July 2026.</strong> Every value below is fictional and exists only to validate the publication model.</p></aside>

      {program.offerings.map((offering) => {
        const offeringClaims = offering.publishedClaims.filter((claim) => claim.planId === null);
        return (
          <section className="offering-section" key={offering.id} aria-labelledby={`${offering.slug}-title`}>
            <header className="offering-header">
              <div>
                <p className="scope-label"><MapPin aria-hidden="true" size={17} /> Residents of {offering.countryCode === "DE" ? "Germany" : "France"}</p>
                <h2 id={`${offering.slug}-title`}>{offering.label}</h2>
              </div>
              <span className="lifecycle">{offering.lifecycle.toLowerCase()}</span>
            </header>
            <dl className="identity-grid">
              <div><dt><Building2 aria-hidden="true" /> Responsible issuer</dt><dd>{offering.issuer.name}</dd></div>
              <div><dt><CreditCard aria-hidden="true" /> Network and type</dt><dd>{offering.network} · {offering.cardType}</dd></div>
              <div><dt><Landmark aria-hidden="true" /> Settlement</dt><dd>{offering.settlementModel}</dd></div>
            </dl>
            <div className="claim-grid">
              {Object.entries(fieldLabels).map(([field, label]) => (
                <article className="claim-card" key={field}>
                  <h3>{label}</h3>
                  <ClaimValue claim={offeringClaims.find((claim) => claim.field === field)} />
                </article>
              ))}
            </div>
            <div className="plans-block">
              <h3>Plan economics</h3>
              <div className="plan-grid">
                {offering.plans.map((plan) => {
                  const planClaims = offering.publishedClaims.filter((claim) => claim.planId === plan.id);
                  return (
                    <article className="plan-card" key={plan.id}>
                      <header><div><p className="eyebrow">Tier {plan.tierOrder}</p><h4>{plan.name}</h4></div><span>{plan.qualification}</span></header>
                      {(["MONTHLY_FEE", "REWARD_RATE", "REWARD_CAP"] as const).map((field) => (
                        <div className="plan-row" key={field}>
                          <span>{field === "MONTHLY_FEE" ? "Monthly fee" : field === "REWARD_RATE" ? "Scenario reward" : "Reward cap"}</span>
                          <ClaimValue compact claim={planClaims.find((claim) => claim.field === field)} />
                        </div>
                      ))}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
      <section className="method-note"><h2>Method and neutrality</h2><p>Eligibility and lifecycle are hard filters. Optional benefits default to zero until a user values them. Affiliate metadata does not exist in this slice and cannot enter the ranking path.</p></section>
    </div>
  );
}
