import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  approveClaim,
  createCandidateClaim,
  publishClaim,
} from "@/modules/publication/publication-service";

let claimId: string | undefined;
let publicationRevisionId: string | undefined;

afterAll(async () => {
  if (claimId) {
    const projection = await prisma.publishedClaim.findUnique({ where: { claimId } });
    publicationRevisionId = projection?.publicationRevisionId;
    await prisma.publishedClaim.deleteMany({ where: { claimId } });
    await prisma.reviewEvent.deleteMany({ where: { claimId } });
    await prisma.claimEvidence.deleteMany({ where: { claimId } });
    await prisma.claim.deleteMany({ where: { id: claimId } });
    if (publicationRevisionId) {
      await prisma.publicationRevision.deleteMany({ where: { id: publicationRevisionId } });
    }
  }
  await prisma.$disconnect();
});

describe("database publication workflow", () => {
  it("enforces separation, publishes atomically, and records audit events", async () => {
    const [offering, researcher, verifier, artifact] = await Promise.all([
      prisma.cardOffering.findUniqueOrThrow({
        where: { slug: "atlas-card-de" },
        include: { plans: { where: { name: "Core" } } },
      }),
      prisma.actor.findUniqueOrThrow({ where: { email: "researcher@fixture.cardstats.test" } }),
      prisma.actor.findUniqueOrThrow({ where: { email: "verifier@fixture.cardstats.test" } }),
      prisma.sourceArtifact.findFirstOrThrow({ where: { source: { slug: "atlas-de-fixture-terms" } } }),
    ]);

    const candidate = await createCandidateClaim({
      offeringId: offering.id,
      planId: offering.plans[0].id,
      field: "SPEND_LIMIT",
      valueState: "KNOWN",
      displayValue: "EUR 5,000/day synthetic integration claim",
      countryCode: "DE",
      effectiveFrom: "2026-07-01",
      observedAt: "2026-07-12T10:00:00.000Z",
      createdById: researcher.id,
      artifactId: artifact.id,
      reason: "Integration fixture submission with scoped evidence.",
    });
    claimId = candidate.id;

    await expect(approveClaim(candidate.id, researcher.id, "Invalid self approval attempt."))
      .rejects.toThrow("A senior verifier or administrator");
    await expect(prisma.claim.update({
      where: { id: candidate.id },
      data: { status: "APPROVED", approvedById: researcher.id },
    })).rejects.toThrow();

    const approved = await approveClaim(candidate.id, verifier.id, "Independent fixture review completed.");
    expect(approved.status).toBe("APPROVED");
    expect(approved.approvedById).toBe(verifier.id);

    const published = await publishClaim(candidate.id, verifier.id, "Publish integration test claim.");
    expect(published.status).toBe("PUBLISHED");

    const [projection, auditEvents] = await Promise.all([
      prisma.publishedClaim.findUniqueOrThrow({ where: { claimId: candidate.id } }),
      prisma.reviewEvent.findMany({ where: { claimId: candidate.id }, orderBy: { createdAt: "asc" } }),
    ]);
    expect(projection.displayValue).toContain("EUR 5,000/day");
    expect(auditEvents.map((event) => event.action)).toEqual(["SUBMITTED", "APPROVED", "PUBLISHED"]);
  });
});
