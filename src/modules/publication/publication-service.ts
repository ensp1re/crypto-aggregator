import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertCanApprove, assertCanPublish } from "./publication-policy";

const candidateSchema = z.object({
  offeringId: z.string().uuid(),
  planId: z.string().uuid().nullable(),
  field: z.enum([
    "ELIGIBILITY",
    "CARD_TYPE",
    "FUNDING_MODEL",
    "ISSUANCE_FEE",
    "MONTHLY_FEE",
    "FX_FEE",
    "ATM_FEE",
    "REWARD_RATE",
    "REWARD_CAP",
    "SPEND_LIMIT",
  ]),
  valueState: z.enum([
    "KNOWN",
    "NOT_OFFERED",
    "NOT_DISCLOSED",
    "NOT_APPLICABLE",
    "CONFLICTING",
    "STALE",
  ]),
  displayValue: z.string().trim().min(1).max(160),
  countryCode: z.string().regex(/^[A-Z]{2}$/),
  effectiveFrom: z.coerce.date(),
  observedAt: z.coerce.date(),
  createdById: z.string().uuid(),
  artifactId: z.string().uuid(),
  reason: z.string().trim().min(8).max(500),
});

const claimInclude = {
  evidence: {
    where: { relation: "SUPPORTS" as const },
  },
} as const;

export async function createCandidateClaim(input: z.input<typeof candidateSchema>) {
  const data = candidateSchema.parse(input);

  return prisma.$transaction(async (tx) => {
    const offering = await tx.cardOffering.findUniqueOrThrow({ where: { id: data.offeringId } });
    const plan = data.planId ? await tx.plan.findUniqueOrThrow({ where: { id: data.planId } }) : null;
    const creator = await tx.actor.findUniqueOrThrow({ where: { id: data.createdById } });
    const artifact = await tx.sourceArtifact.findUniqueOrThrow({ where: { id: data.artifactId } });

    if (plan && plan.offeringId !== offering.id) {
      throw new Error("The selected plan does not belong to the selected offering.");
    }
    if (!(["RESEARCHER", "ADMINISTRATOR"] as const).includes(creator.role as "RESEARCHER" | "ADMINISTRATOR")) {
      throw new Error("Only a researcher or administrator can create a candidate claim.");
    }

    return tx.claim.create({
      data: {
        offeringId: offering.id,
        planId: plan?.id,
        field: data.field,
        valueState: data.valueState,
        displayValue: data.displayValue,
        countryCode: data.countryCode,
        effectiveFrom: data.effectiveFrom,
        observedAt: data.observedAt,
        createdById: creator.id,
        status: "IN_REVIEW",
        evidence: {
          create: {
            artifactId: artifact.id,
            relation: "SUPPORTS",
            excerptHash: artifact.contentHash,
          },
        },
        reviewEvents: {
          create: {
            actorId: creator.id,
            action: "SUBMITTED",
            reason: data.reason,
          },
        },
      },
      include: claimInclude,
    });
  });
}

export async function approveClaim(claimId: string, reviewerId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const claim = await tx.claim.findUniqueOrThrow({ where: { id: claimId }, include: claimInclude });
    const reviewer = await tx.actor.findUniqueOrThrow({ where: { id: reviewerId } });

    assertCanApprove(
      { ...claim, supportingEvidenceCount: claim.evidence.length },
      reviewer,
    );

    return tx.claim.update({
      where: { id: claim.id },
      data: {
        status: "APPROVED",
        approvedById: reviewer.id,
        reviewEvents: {
          create: { actorId: reviewer.id, action: "APPROVED", reason },
        },
      },
      include: claimInclude,
    });
  });
}

export async function publishClaim(claimId: string, publisherId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const claim = await tx.claim.findUniqueOrThrow({ where: { id: claimId }, include: claimInclude });
    const publisher = await tx.actor.findUniqueOrThrow({ where: { id: publisherId } });
    const latestRevision = await tx.publicationRevision.findFirst({ orderBy: { version: "desc" } });

    assertCanPublish(
      { ...claim, supportingEvidenceCount: claim.evidence.length },
      publisher,
    );

    const publishedAt = new Date();
    const revision = await tx.publicationRevision.create({
      data: {
        version: (latestRevision?.version ?? 0) + 1,
        summary: reason,
        publishedById: publisher.id,
        publishedAt,
      },
    });

    const existing = await tx.publishedClaim.findFirst({
      where: {
        offeringId: claim.offeringId,
        planId: claim.planId,
        field: claim.field,
        countryCode: claim.countryCode,
      },
    });
    const projection = {
      claimId: claim.id,
      offeringId: claim.offeringId,
      planId: claim.planId,
      field: claim.field,
      valueState: claim.valueState,
      displayValue: claim.displayValue,
      valueJson: claim.valueJson ?? undefined,
      countryCode: claim.countryCode,
      effectiveFrom: claim.effectiveFrom,
      effectiveTo: claim.effectiveTo,
      observedAt: claim.observedAt,
      publishedAt,
      publicationRevisionId: revision.id,
    };

    if (existing) {
      await tx.publishedClaim.update({ where: { id: existing.id }, data: projection });
    } else {
      await tx.publishedClaim.create({ data: projection });
    }

    await tx.reviewEvent.create({
      data: { claimId: claim.id, actorId: publisher.id, action: "PUBLISHED", reason },
    });

    return tx.claim.update({
      where: { id: claim.id },
      data: { status: "PUBLISHED", publishedAt },
      include: claimInclude,
    });
  });
}
