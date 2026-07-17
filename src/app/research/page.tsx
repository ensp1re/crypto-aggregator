import type { Metadata } from "next";
import { ClipboardCheck, FilePlus2, ShieldCheck } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { getResearchWorkspace } from "@/modules/catalog/queries";
import { approveClaimAction, createCandidateAction, publishClaimAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Synthetic research workflow",
  robots: { index: false, follow: false },
};

export default async function ResearchPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const [{ claims, actors, offerings, artifacts }, params] = await Promise.all([getResearchWorkspace(), searchParams]);
  const researcher = actors.find((actor) => actor.role === "RESEARCHER")!;
  const verifier = actors.find((actor) => actor.role === "SENIOR_VERIFIER")!;

  return (
    <div className="shell page-stack">
      <header className="page-header"><div><p className="eyebrow">Private synthetic workspace</p><h1>Evidence review and publication</h1><p className="lede">Exercise candidate capture, independent approval, atomic publication, and audit history without accounts or live sources.</p></div><ShieldCheck aria-hidden="true" size={42} /></header>
      <aside className="notice warning"><ShieldCheck aria-hidden="true" /><p><strong>Prototype authorization only.</strong> Fixed fixture actors replace authentication; never deploy this route publicly.</p></aside>
      {params.status && <p className="success-message" role="status">{params.status}</p>}

      <section className="research-layout" aria-label="Research workflow">
        <div className="research-create">
          <header className="section-heading"><FilePlus2 aria-hidden="true" /><div><p className="eyebrow">Step 1</p><h2>Create candidate</h2></div></header>
          <form action={createCandidateAction} className="form-stack">
            <input type="hidden" name="createdById" value={researcher.id} />
            <label>Offering<select name="offeringId" required>{offerings.map((offering) => <option value={offering.id} key={offering.id}>{offering.countryCode} · {offering.label}</option>)}</select></label>
            <label>Plan<select name="planId"><option value="">Offering-level claim</option>{offerings.flatMap((offering) => offering.plans.map((plan) => <option value={plan.id} key={plan.id}>{offering.countryCode} · {plan.name}</option>))}</select></label>
            <div className="form-grid"><label>Field<select name="field" defaultValue="REWARD_RATE"><option value="REWARD_RATE">Reward rate</option><option value="MONTHLY_FEE">Monthly fee</option><option value="REWARD_CAP">Reward cap</option><option value="ATM_FEE">ATM fee</option></select></label><label>Value state<select name="valueState" defaultValue="KNOWN"><option value="KNOWN">Known</option><option value="NOT_DISCLOSED">Not disclosed</option><option value="CONFLICTING">Conflicting</option><option value="STALE">Stale</option></select></label></div>
            <label>Country code<input name="countryCode" required pattern="[A-Z]{2}" maxLength={2} defaultValue="DE" /></label>
            <label>Display value<input name="displayValue" required maxLength={160} placeholder="For example, 1.25% up to EUR 20/month" /></label>
            <label>Effective from<input type="date" name="effectiveFrom" required defaultValue="2026-08-01" /></label>
            <label>Evidence fixture<select name="artifactId" required>{artifacts.map((artifact) => <option value={artifact.id} key={artifact.id}>{artifact.source.title}</option>)}</select></label>
            <label>Submission reason<textarea name="reason" required minLength={8} maxLength={500} defaultValue="Captured from the scoped synthetic terms fixture." /></label>
            <SubmitButton pendingLabel="Submitting candidate…">Submit candidate</SubmitButton>
          </form>
        </div>

        <div className="research-queue">
          <header className="section-heading"><ClipboardCheck aria-hidden="true" /><div><p className="eyebrow">Steps 2–3</p><h2>Review queue</h2></div></header>
          {claims.length === 0 ? <p className="empty-state">No claims await review. Create a candidate to exercise the workflow.</p> : claims.map((claim) => (
            <article className="review-card" key={claim.id}>
              <header><div><p className="scope-label">{claim.countryCode} · {claim.offering.label}{claim.plan ? ` · ${claim.plan.name}` : ""}</p><h3>{claim.field.replaceAll("_", " ").toLowerCase()}</h3></div><span className="status-chip">{claim.status.replaceAll("_", " ").toLowerCase()}</span></header>
              <p className="candidate-value">{claim.displayValue}</p>
              <dl className="review-meta"><div><dt>Created by</dt><dd>{claim.createdBy.displayName}</dd></div><div><dt>Evidence</dt><dd>{claim.evidence[0]?.artifact.source.title ?? "Missing"}</dd></div><div><dt>Audit events</dt><dd>{claim.reviewEvents.length}</dd></div></dl>
              {claim.status === "IN_REVIEW" ? (
                <form action={approveClaimAction} className="inline-action">
                  <input type="hidden" name="claimId" value={claim.id} /><input type="hidden" name="reviewerId" value={verifier.id} /><input type="hidden" name="reason" value="Scope and supporting synthetic evidence independently verified." />
                  <SubmitButton pendingLabel="Approving claim…">Approve as {verifier.displayName}</SubmitButton>
                </form>
              ) : (
                <form action={publishClaimAction} className="inline-action">
                  <input type="hidden" name="claimId" value={claim.id} /><input type="hidden" name="publisherId" value={verifier.id} /><input type="hidden" name="reason" value="Publish approved synthetic candidate and refresh the public projection." />
                  <SubmitButton pendingLabel="Publishing claim…">Publish approved claim</SubmitButton>
                </form>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
