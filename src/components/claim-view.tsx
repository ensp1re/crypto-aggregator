import { AlertTriangle, CheckCircle2, Clock3, FileCheck2, MinusCircle } from "lucide-react";
import type { ValueState } from "@/generated/prisma/enums";

const statePresentation: Record<
  ValueState,
  { label: string; className: string; Icon: typeof CheckCircle2 }
> = {
  KNOWN: { label: "Verified", className: "state-known", Icon: CheckCircle2 },
  NOT_OFFERED: { label: "Not offered", className: "state-neutral", Icon: MinusCircle },
  NOT_DISCLOSED: { label: "Undisclosed", className: "state-unknown", Icon: FileCheck2 },
  NOT_APPLICABLE: { label: "Not applicable", className: "state-neutral", Icon: MinusCircle },
  CONFLICTING: { label: "Sources conflict", className: "state-warning", Icon: AlertTriangle },
  STALE: { label: "Needs recheck", className: "state-warning", Icon: Clock3 },
};

type EvidenceClaim = {
  valueState: ValueState;
  displayValue: string;
  observedAt: Date;
  publishedAt: Date;
  claim: {
    evidence: Array<{
      artifact: {
        locator: string;
        rightsStatus: string;
        source: { title: string; authorityTier: string; sourceType: string };
      };
    }>;
  };
};

export function ClaimValue({ claim, compact = false }: { claim?: EvidenceClaim; compact?: boolean }) {
  if (!claim) {
    return <span className="state-badge state-unknown">No published value</span>;
  }
  const state = statePresentation[claim.valueState];
  const Icon = state.Icon;
  const observed = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(claim.observedAt);

  return (
    <div className={compact ? "claim-value compact" : "claim-value"}>
      <span className={`state-badge ${state.className}`}>
        <Icon aria-hidden="true" size={15} strokeWidth={2} />
        {state.label}
      </span>
      <strong>{claim.displayValue}</strong>
      {!compact && (
        <details className="evidence-details">
          <summary>Inspect evidence</summary>
          <div className="evidence-panel">
            <p>
              Observed {observed}. Published from revision evidence; synthetic fixture only.
            </p>
            {claim.claim.evidence.map(({ artifact }) => (
              <dl key={`${artifact.source.title}-${artifact.locator}`}>
                <div><dt>Source</dt><dd>{artifact.source.title}</dd></div>
                <div><dt>Authority</dt><dd>Tier {artifact.source.authorityTier} · {artifact.source.sourceType}</dd></div>
                <div><dt>Location</dt><dd>{artifact.locator}</dd></div>
                <div><dt>Rights</dt><dd>{artifact.rightsStatus}</dd></div>
              </dl>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
