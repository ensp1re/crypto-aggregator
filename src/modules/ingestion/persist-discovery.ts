import { createHash } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import snapshot from "@/modules/catalog/discovery-snapshot.json";
import { cryptoAggDiscoveryCardSchema } from "./cryptoagg-adapter";

const COLLECTOR = "cryptoagg-public-bundle";
const COLLECTOR_VERSION = "1";
const RIGHTS_BASIS = "Competitor discovery observation; independent official verification required before publication";

const snapshotSchema = z.object({
  schemaVersion: z.literal(1),
  source: z.object({
    title: z.string().min(1),
    url: z.string().url(),
    bundleUrl: z.string().url(),
    observedAt: z.iso.datetime(),
    authority: z.literal("competitor-discovery"),
    rights: z.string().min(1),
  }),
  cards: z.array(cryptoAggDiscoveryCardSchema).min(20).max(250),
});

export function prepareDiscoveryImport(input: unknown = snapshot) {
  const parsed = snapshotSchema.parse(input);
  const observedAt = new Date(parsed.source.observedAt);
  if (observedAt.getTime() > Date.now() + 5 * 60_000) throw new Error("Discovery observation time cannot be in the future");

  const contentHash = createHash("sha256").update(JSON.stringify(parsed)).digest("hex");
  return {
    source: parsed.source,
    observedAt,
    contentHash,
    candidates: parsed.cards.map((card) => ({
      externalKey: card.id,
      canonicalHint: card.id === "Kripicard" ? "Kripicard Premium" : card.name,
      issuerHint: card.issuer,
      officialUrl: card.officialLink,
      observation: card,
      status: "DISCOVERED" as const,
      rightsBasis: RIGHTS_BASIS,
      discoveredAt: observedAt,
    })),
  };
}

export async function persistDiscoveryImport() {
  const prepared = prepareDiscoveryImport();

  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('cardstats:cryptoagg-discovery-import'))`;

    const source = await tx.source.upsert({
      where: { slug: "cryptoagg-public-catalog" },
      update: {
        title: prepared.source.title,
        url: prepared.source.url,
        sourceType: "competitor discovery index",
        authorityTier: "D",
        rightsStatus: RIGHTS_BASIS,
      },
      create: {
        slug: "cryptoagg-public-catalog",
        title: prepared.source.title,
        url: prepared.source.url,
        sourceType: "competitor discovery index",
        authorityTier: "D",
        rightsStatus: RIGHTS_BASIS,
      },
    });

    const artifact = await tx.sourceArtifact.upsert({
      where: { contentHash: prepared.contentHash },
      update: {},
      create: {
        sourceId: source.id,
        observedAt: prepared.observedAt,
        contentHash: prepared.contentHash,
        locator: prepared.source.bundleUrl,
        mimeType: "application/json",
        rightsStatus: RIGHTS_BASIS,
        fixturePath: "src/modules/catalog/discovery-snapshot.json",
      },
    });

    const existing = await tx.sourceImportRun.findFirst({
      where: {
        sourceId: source.id,
        artifactId: artifact.id,
        collector: COLLECTOR,
        collectorVersion: COLLECTOR_VERSION,
      },
      include: { _count: { select: { candidates: true } } },
    });
    if (existing) {
      return { runId: existing.id, candidateCount: existing._count.candidates, created: false };
    }

    const run = await tx.sourceImportRun.create({
      data: {
        sourceId: source.id,
        artifactId: artifact.id,
        status: "QUARANTINED",
        collector: COLLECTOR,
        collectorVersion: COLLECTOR_VERSION,
        finishedAt: new Date(),
        observedCount: prepared.candidates.length,
        acceptedCount: 0,
        candidates: { create: prepared.candidates },
      },
      include: { _count: { select: { candidates: true } } },
    });

    return { runId: run.id, candidateCount: run._count.candidates, created: true };
  }, { isolationLevel: "Serializable" });
}
