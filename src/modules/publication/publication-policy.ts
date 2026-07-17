export type ReviewRole =
  | "RESEARCHER"
  | "SENIOR_VERIFIER"
  | "ADMINISTRATOR"
  | "COMMERCIAL_OPERATOR";

export type ClaimForReview = {
  status: "CANDIDATE" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "REJECTED";
  critical: boolean;
  valueState:
    | "KNOWN"
    | "NOT_OFFERED"
    | "NOT_DISCLOSED"
    | "NOT_APPLICABLE"
    | "CONFLICTING"
    | "STALE";
  createdById: string;
  approvedById?: string | null;
  supportingEvidenceCount: number;
};

export class PublicationPolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicationPolicyError";
  }
}

export function assertCanApprove(
  claim: ClaimForReview,
  reviewer: { id: string; role: ReviewRole },
) {
  if (!(["SENIOR_VERIFIER", "ADMINISTRATOR"] as ReviewRole[]).includes(reviewer.role)) {
    throw new PublicationPolicyError("A senior verifier or administrator must approve this claim.");
  }
  if (claim.createdById === reviewer.id) {
    throw new PublicationPolicyError("A claim creator cannot approve their own claim.");
  }
  if (!(["CANDIDATE", "IN_REVIEW"] as ClaimForReview["status"][]).includes(claim.status)) {
    throw new PublicationPolicyError("Only candidate or in-review claims can be approved.");
  }
  if (claim.critical && claim.valueState === "KNOWN" && claim.supportingEvidenceCount === 0) {
    throw new PublicationPolicyError("A known critical claim requires supporting evidence.");
  }
}

export function assertCanPublish(
  claim: ClaimForReview,
  publisher: { id: string; role: ReviewRole },
) {
  if (!(["SENIOR_VERIFIER", "ADMINISTRATOR"] as ReviewRole[]).includes(publisher.role)) {
    throw new PublicationPolicyError("A senior verifier or administrator must publish this claim.");
  }
  if (claim.status !== "APPROVED" || !claim.approvedById) {
    throw new PublicationPolicyError("Only independently approved claims can be published.");
  }
  if (claim.createdById === claim.approvedById) {
    throw new PublicationPolicyError("Critical review must remain independent from claim creation.");
  }
  if (claim.critical && claim.valueState === "KNOWN" && claim.supportingEvidenceCount === 0) {
    throw new PublicationPolicyError("A known critical claim requires supporting evidence.");
  }
}
