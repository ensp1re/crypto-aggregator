import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { assertCanApprove, assertCanPublish } from "./publication-policy";

const candidateSchema = z.object({
  offeringId: z.string().uuid(),
  planId: z.string().uuid().nullable().default(null),
  planScopeIds: z.array(z.string().uuid()).max(12).default([]),
  field: z.enum([
    "ELIGIBILITY",
    "CARD_TYPE",
    "NETWORK",
    "FUNDING_MODEL",
    "SUPPORTED_ASSETS",
    "KYC",
    "ISSUANCE_FEE",
    "SHIPPING_FEE",
    "MONTHLY_FEE",
    "ANNUAL_FEE",
    "TOP_UP_FEE",
    "CONVERSION_FEE",
    "FX_FEE",
    "ATM_FEE",
    "ATM_LIMIT",
    "REWARD_RATE",
    "REWARD_CAP",
    "REWARD_CURRENCY",
    "REWARD_QUALIFICATION",
    "MOBILE_WALLET",
    "BENEFIT",
    "PROMOTION",
    "SPEND_LIMIT",
  ]),
  subjectKey: z.string().trim().min(1).max(160).regex(/^[a-z0-9][a-z0-9:_-]*$/).default("default"),
  valueState: z.enum([
    "KNOWN",
    "NOT_OFFERED",
    "NOT_DISCLOSED",
    "NOT_APPLICABLE",
    "CONFLICTING",
    "STALE",
  ]),
  displayValue: z.string().trim().min(1).max(160),
  valueJson: z.record(z.string(), z.unknown()).optional(),
  countryCode: z.string().regex(/^[A-Z]{2}$/),
  critical: z.boolean().default(true),
  effectiveFrom: z.coerce.date(),
  effectiveTo: z.coerce.date().nullable().default(null),
  observedAt: z.coerce.date(),
  createdById: z.string().uuid(),
  artifactId: z.string().uuid(),
  reason: z.string().trim().min(8).max(500),
});

const claimInclude = {
  evidence: {
    where: { relation: "SUPPORTS" as const },
  },
  planScopes: {
    include: { plan: { include: { dimension: true } } },
  },
} as const;

function claimScopeKey(plans: Array<{ slug: string; dimension: { slug: string } }>) {
  const scopes = plans.map(({ slug, dimension }) => `${dimension.slug}:${slug}`).sort();
  return scopes.length ? scopes.join("+") : "offering";
}

export async function createCandidateClaim(input: z.input<typeof candidateSchema>) {
  const data = candidateSchema.parse(input);

  return prisma.$transaction(async (tx) => {
    const offering = await tx.cardOffering.findUniqueOrThrow({ where: { id: data.offeringId } });
    const requestedPlanIds = [...new Set([...data.planScopeIds, ...(data.planId ? [data.planId] : [])])];
    const scopedPlans = requestedPlanIds.length
      ? await tx.plan.findMany({ where: { id: { in: requestedPlanIds } }, include: { dimension: true } })
      : [];
    const plan = data.planId ? scopedPlans.find(({ id }) => id === data.planId) ?? null : null;
    const creator = await tx.actor.findUniqueOrThrow({ where: { id: data.createdById } });
    const artifact = await tx.sourceArtifact.findUniqueOrThrow({ where: { id: data.artifactId } });

    if (scopedPlans.length !== requestedPlanIds.length || scopedPlans.some(({ offeringId }) => offeringId !== offering.id)) {
      throw new Error("Every selected plan option must belong to the selected offering.");
    }
    if (!(["RESEARCHER", "ADMINISTRATOR"] as const).includes(creator.role as "RESEARCHER" | "ADMINISTRATOR")) {
      throw new Error("Only a researcher or administrator can create a candidate claim.");
    }

    return tx.claim.create({
      data: {
        offeringId: offering.id,
        planId: plan?.id,
        field: data.field,
        subjectKey: data.subjectKey,
        scopeKey: claimScopeKey(scopedPlans),
        valueState: data.valueState,
        displayValue: data.displayValue,
        valueJson: data.valueJson as Prisma.InputJsonValue | undefined,
        countryCode: data.countryCode,
        critical: data.critical,
        effectiveFrom: data.effectiveFrom,
        effectiveTo: data.effectiveTo,
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
        planScopes: {
          create: scopedPlans.map(({ id }) => ({ planId: id })),
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
        field: claim.field,
        subjectKey: claim.subjectKey,
        scopeKey: claim.scopeKey,
        countryCode: claim.countryCode,
      },
    });
    const projection = {
      claimId: claim.id,
      offeringId: claim.offeringId,
      planId: claim.planId,
      field: claim.field,
      subjectKey: claim.subjectKey,
      scopeKey: claim.scopeKey,
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

    const planScopes = { create: claim.planScopes.map(({ planId }) => ({ planId })) };
    if (existing) {
      await tx.publishedClaim.update({
        where: { id: existing.id },
        data: { ...projection, planScopes: { deleteMany: {}, ...planScopes } },
      });
    } else {
      await tx.publishedClaim.create({ data: { ...projection, planScopes } });
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
