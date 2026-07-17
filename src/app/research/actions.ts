"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertResearchWorkbenchAvailable } from "@/lib/research-access";

function required(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string" || !value.trim()) throw new Error(`${name} is required`);
  return value;
}

function finish(message: string) {
  revalidatePath("/research");
  revalidatePath("/programs/atlas-card");
  revalidatePath("/compare");
  redirect(`/research?status=${encodeURIComponent(message)}`);
}

export async function createCandidateAction(formData: FormData) {
  assertResearchWorkbenchAvailable();
  const { createCandidateClaim } = await import("@/modules/publication/publication-service");
  const planValue = formData.get("planId");
  await createCandidateClaim({
    offeringId: required(formData, "offeringId"),
    planId: typeof planValue === "string" && planValue ? planValue : null,
    field: required(formData, "field") as "REWARD_RATE",
    valueState: required(formData, "valueState") as "KNOWN",
    displayValue: required(formData, "displayValue"),
    countryCode: required(formData, "countryCode"),
    effectiveFrom: required(formData, "effectiveFrom"),
    observedAt: new Date(),
    createdById: required(formData, "createdById"),
    artifactId: required(formData, "artifactId"),
    reason: required(formData, "reason"),
  });
  finish("Candidate claim submitted for independent review.");
}

export async function approveClaimAction(formData: FormData) {
  assertResearchWorkbenchAvailable();
  const { approveClaim } = await import("@/modules/publication/publication-service");
  await approveClaim(required(formData, "claimId"), required(formData, "reviewerId"), required(formData, "reason"));
  finish("Claim independently approved.");
}

export async function publishClaimAction(formData: FormData) {
  assertResearchWorkbenchAvailable();
  const { publishClaim } = await import("@/modules/publication/publication-service");
  await publishClaim(required(formData, "claimId"), required(formData, "publisherId"), required(formData, "reason"));
  finish("Claim published to the public read projection.");
}
