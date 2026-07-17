import { describe, expect, it } from "vitest";
import {
  assertCanApprove,
  assertCanPublish,
  PublicationPolicyError,
  type ClaimForReview,
} from "@/modules/publication/publication-policy";

const candidate: ClaimForReview = {
  status: "IN_REVIEW",
  critical: true,
  valueState: "KNOWN",
  createdById: "researcher",
  approvedById: null,
  supportingEvidenceCount: 1,
};

describe("publication policy", () => {
  it("rejects self-approval", () => {
    expect(() => assertCanApprove(candidate, { id: "researcher", role: "SENIOR_VERIFIER" }))
      .toThrowError(new PublicationPolicyError("A claim creator cannot approve their own claim."));
  });

  it("rejects a known critical claim without evidence", () => {
    expect(() => assertCanApprove(
      { ...candidate, supportingEvidenceCount: 0 },
      { id: "verifier", role: "SENIOR_VERIFIER" },
    )).toThrow("requires supporting evidence");
  });

  it("allows an independent senior verifier to approve an evidenced candidate", () => {
    expect(() => assertCanApprove(candidate, { id: "verifier", role: "SENIOR_VERIFIER" })).not.toThrow();
  });

  it("publishes only after independent approval", () => {
    expect(() => assertCanPublish(
      { ...candidate, status: "APPROVED", approvedById: "verifier" },
      { id: "verifier", role: "SENIOR_VERIFIER" },
    )).not.toThrow();
    expect(() => assertCanPublish(candidate, { id: "verifier", role: "SENIOR_VERIFIER" }))
      .toThrow("Only independently approved claims");
  });
});
