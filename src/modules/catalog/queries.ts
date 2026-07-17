import { prisma } from "@/lib/prisma";

const evidenceInclude = {
  claim: {
    include: {
      evidence: {
        include: {
          artifact: { include: { source: true } },
        },
      },
    },
  },
} as const;

export async function getAtlasProgram() {
  return prisma.cardProgram.findUniqueOrThrow({
    where: { slug: "atlas-card" },
    include: {
      ownerOrganization: true,
      offerings: {
        orderBy: { countryCode: "asc" },
        include: {
          issuer: true,
          plans: { orderBy: { tierOrder: "asc" } },
          publishedClaims: {
            orderBy: [{ planId: "asc" }, { field: "asc" }],
            include: evidenceInclude,
          },
        },
      },
    },
  });
}

export async function getResearchWorkspace() {
  const [claims, actors, offerings, artifacts] = await Promise.all([
    prisma.claim.findMany({
      where: { status: { in: ["IN_REVIEW", "APPROVED"] } },
      orderBy: { createdAt: "asc" },
      include: {
        offering: { include: { program: true } },
        plan: true,
        createdBy: true,
        approvedBy: true,
        evidence: { include: { artifact: { include: { source: true } } } },
        reviewEvents: { include: { actor: true }, orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.actor.findMany({ orderBy: { role: "asc" } }),
    prisma.cardOffering.findMany({
      orderBy: { countryCode: "asc" },
      include: { plans: { orderBy: { tierOrder: "asc" } } },
    }),
    prisma.sourceArtifact.findMany({ include: { source: true }, orderBy: { observedAt: "desc" } }),
  ]);

  return { claims, actors, offerings, artifacts };
}
