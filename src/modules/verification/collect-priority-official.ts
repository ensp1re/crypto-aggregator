import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { officialCatalogTargets } from "./official-catalog-targets";
import { officialCatalogResearchBlockers } from "./final-catalog-sources";
import { priorityOfficialSources, type OfficialSourceDefinition } from "./priority-official-sources";
import { normalizeCandidatePlanResearch } from "./candidate-plan-normalizer";

const ALLOWED_HOSTS = new Set(priorityOfficialSources.map(({ url }) => new URL(url).hostname));
const RIGHTS = "Official public source; retain factual extraction, hashes, and link for editorial verification";
const INVENTORY_RIGHTS = "Official product URL used for independent catalog coverage and verification planning";
const RESEARCH_USER_AGENT = "Mozilla/5.0 (compatible; CardStatsResearch/0.1; +https://cardstats.app/methodology)";

type FetchedOfficialSource = {
  definition: OfficialSourceDefinition;
  response: {
    finalUrl: string;
    mimeType: string;
    html: string;
    text: string;
  };
};

function decodeHtml(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, decimal: string) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&nbsp;", " ")
    .replaceAll("&euro;", "€").replaceAll("&pound;", "£")
    .replaceAll("&ndash;", "–").replaceAll("&mdash;", "—").replaceAll("&rsquo;", "’");
}

function visibleText(html: string) {
  return decodeHtml(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ").trim();
}

export function officialContentHash(text: string) {
  return createHash("sha256").update(text.replace(/\s+/g, " ").trim()).digest("hex");
}

async function safeFetch(definition: OfficialSourceDefinition) {
  let url = new URL(definition.url);
  const timeoutMs = url.hostname === "www.bybit.com" ? 60_000 : 20_000;
  const userAgent = url.hostname === "www.bybit.com" ? "CardStatsResearch/0.1" : RESEARCH_USER_AGENT;
  for (let redirects = 0; redirects <= 3; redirects += 1) {
    if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)) throw new Error(`Blocked official-source URL: ${url.href}`);
    let response = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        "accept-language": "en-US,en;q=0.9",
        "user-agent": userAgent,
      },
    });
    const helpCenterArticleId = url.pathname.match(/\/articles\/(\d+)/)?.[1];
    if ((response.status === 401 || response.status === 403) && helpCenterArticleId) {
      const helpCenterLocale = url.pathname.match(/\/hc\/([a-z]{2}-[a-z]{2})\//i)?.[1] ?? "en-us";
      const apiUrl = new URL(`/api/v2/help_center/${helpCenterLocale}/articles/${helpCenterArticleId}.json`, url);
      response = await fetch(apiUrl, {
        redirect: "manual",
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          "accept-language": "en-US,en;q=0.9",
          "user-agent": userAgent,
        },
      });
    }
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error(`Redirect without location for ${url.href}`);
      url = new URL(location, url);
      continue;
    }
    if (!response.ok) throw new Error(`${definition.slug} returned HTTP ${response.status}`);
    const mimeType = response.headers.get("content-type")?.split(";")[0] ?? "";
    if (mimeType !== "text/html" && mimeType !== "application/json") throw new Error(`${definition.slug} returned unexpected ${mimeType}`);
    const content = await response.text();
    if (Buffer.byteLength(content) > 3_000_000) throw new Error(`${definition.slug} exceeded byte limit`);
    let finalUrl = url.href;
    let text = visibleText(content);
    if (mimeType === "application/json") {
      const payload: unknown = JSON.parse(content);
      const article = typeof payload === "object" && payload !== null && "article" in payload ? payload.article : undefined;
      if (typeof article !== "object" || article === null || !("body" in article) || typeof article.body !== "string") {
        throw new Error(`${definition.slug} returned malformed article JSON`);
      }
      if ("html_url" in article && typeof article.html_url === "string") {
        const articleUrl = new URL(article.html_url);
        if (articleUrl.protocol !== "https:" || !ALLOWED_HOSTS.has(articleUrl.hostname)) throw new Error(`Blocked article URL: ${articleUrl.href}`);
        finalUrl = articleUrl.href;
      }
      text = visibleText(article.body);
    }
    for (const fact of definition.facts) {
      for (const term of fact.requiredTerms) {
        if (!text.toLocaleLowerCase("en-US").includes(term.toLocaleLowerCase("en-US"))) {
          throw new Error(`${definition.slug}:${fact.fieldKey} missing required term: ${term}`);
        }
      }
    }
    return { finalUrl, mimeType, html: content, text };
  }
  throw new Error(`Too many redirects for ${definition.slug}`);
}

export async function fetchPriorityOfficialSources(): Promise<FetchedOfficialSource[]> {
  const fetched: FetchedOfficialSource[] = [];
  for (const definition of priorityOfficialSources) {
    try {
      fetched.push({ definition, response: await safeFetch(definition) });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`${definition.slug} fetch failed: ${message}`, { cause: error });
    }
  }
  return fetched;
}

export async function collectPriorityOfficialEvidence() {
  const observedAt = new Date();
  const fetched = await fetchPriorityOfficialSources();
  const blockerKeys = new Set(officialCatalogResearchBlockers.map(({ candidateKey }) => candidateKey));
  const planProfiles = normalizeCandidatePlanResearch(priorityOfficialSources, blockerKeys);

  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('cardstats:priority-official-evidence'))`;
    const inventorySource = await tx.source.upsert({
      where: { slug: "cardstats-official-catalog-targets" },
      update: {},
      create: {
        slug: "cardstats-official-catalog-targets",
        title: "CardStats official-source coverage targets",
        url: "https://cardstats.app/methodology",
        sourceType: "editorial official-source inventory",
        authorityTier: "D",
        rightsStatus: INVENTORY_RIGHTS,
      },
    });
    let inventoryRun = await tx.sourceImportRun.findFirst({
      where: { sourceId: inventorySource.id, collector: "official-catalog-targets", collectorVersion: "1" },
    });
    inventoryRun ??= await tx.sourceImportRun.create({
      data: {
        sourceId: inventorySource.id,
        status: "QUARANTINED",
        collector: "official-catalog-targets",
        collectorVersion: "1",
        finishedAt: observedAt,
        observedCount: officialCatalogTargets.length,
        acceptedCount: 0,
      },
    });
    for (const target of officialCatalogTargets) {
      const existing = await tx.discoveryCandidate.findFirst({ where: { externalKey: target.key } });
      if (!existing) {
        await tx.discoveryCandidate.create({
          data: {
            importRunId: inventoryRun.id,
            externalKey: target.key,
            canonicalHint: target.name,
            issuerHint: target.issuer,
            officialUrl: target.officialUrl,
            observation: { discoveryBasis: "official product URL", officialUrl: target.officialUrl },
            status: "DISCOVERED",
            rightsBasis: INVENTORY_RIGHTS,
            discoveredAt: observedAt,
          },
        });
      }
    }
    let evidenceCount = 0;
    for (const { definition, response } of fetched) {
      const candidate = await tx.discoveryCandidate.findFirstOrThrow({
        where: { externalKey: definition.candidateKey },
        orderBy: { discoveredAt: "desc" },
      });
      const source = await tx.source.upsert({
        where: { slug: definition.slug },
        update: { title: definition.title, url: response.finalUrl, sourceType: definition.sourceType, authorityTier: definition.authorityTier, rightsStatus: RIGHTS },
        create: { slug: definition.slug, title: definition.title, url: response.finalUrl, sourceType: definition.sourceType, authorityTier: definition.authorityTier, rightsStatus: RIGHTS },
      });
      const contentHash = officialContentHash(response.text);
      const artifact = await tx.sourceArtifact.upsert({
        where: { contentHash }, update: {},
        create: { sourceId: source.id, observedAt, contentHash, locator: response.finalUrl, mimeType: response.mimeType, rightsStatus: RIGHTS },
      });
      for (const fact of definition.facts) {
        const excerptBasis = fact.requiredTerms.join(" | ");
        await tx.discoveryCandidateEvidence.upsert({
          where: { candidateId_artifactId_fieldKey: { candidateId: candidate.id, artifactId: artifact.id, fieldKey: fact.fieldKey } },
          update: { displayValue: fact.displayValue, valueJson: fact.valueJson, scopeJson: fact.scopeJson, observedAt },
          create: {
            candidateId: candidate.id, artifactId: artifact.id, fieldKey: fact.fieldKey,
            excerptHash: createHash("sha256").update(excerptBasis).digest("hex"), displayValue: fact.displayValue,
            valueJson: fact.valueJson, scopeJson: fact.scopeJson, observedAt,
          },
        });
        evidenceCount += 1;
      }
      await tx.discoveryCandidate.update({
        where: { id: candidate.id },
        data: { status: "VERIFYING", reviewReason: "Official evidence collected; normalization and independent review required before promotion." },
      });
    }
    for (const blocker of officialCatalogResearchBlockers) {
      const candidate = await tx.discoveryCandidate.findFirstOrThrow({
        where: { externalKey: blocker.candidateKey },
        orderBy: { discoveredAt: "desc" },
      });
      await tx.discoveryCandidate.update({
        where: { id: candidate.id },
        data: {
          status: "TRIAGED",
          planResearchStatus: "BLOCKED",
          planResearchReason: blocker.reason,
          officialUrl: blocker.officialUrl,
          reviewedAt: observedAt,
          reviewReason: blocker.reason,
        },
      });
    }
    for (const profile of planProfiles) {
      const candidate = await tx.discoveryCandidate.findFirstOrThrow({
        where: { externalKey: profile.candidateKey },
        orderBy: { discoveredAt: "desc" },
      });
      await tx.candidatePlanDimension.deleteMany({ where: { candidateId: candidate.id } });
      await tx.discoveryCandidate.update({
        where: { id: candidate.id },
        data: {
          planResearchStatus: profile.status,
          planResearchReason: profile.reason,
          planDimensions: {
            create: profile.dimensions.map((dimension) => ({
              slug: dimension.slug,
              label: dimension.label,
              kind: dimension.kind,
              combinable: dimension.combinable,
              displayOrder: dimension.displayOrder,
              observedAt,
              options: {
                create: dimension.options.map((option) => ({
                  slug: option.slug,
                  name: option.name,
                  tierOrder: option.tierOrder,
                  qualification: option.qualification,
                  lifecycle: option.lifecycle,
                  displayValue: option.displayValue,
                  valueJson: option.valueJson,
                  scopeJson: option.scopeJson,
                  sourceFieldKeys: option.sourceFieldKeys,
                  observedAt,
                })),
              },
            })),
          },
        },
      });
    }
    return {
      sourceCount: fetched.length,
      evidenceCount,
      candidateCount: new Set(fetched.map(({ definition }) => definition.candidateKey)).size,
      blockerCount: officialCatalogResearchBlockers.length,
      structuredPlanCandidateCount: planProfiles.filter(({ status }) => status === "STRUCTURED").length,
      partialPlanCandidateCount: planProfiles.filter(({ status }) => status === "PARTIAL").length,
    };
  }, { isolationLevel: "Serializable", timeout: 30_000 });
}

export async function repairLegacyOfficialArtifactHashes() {
  const fetched = await fetchPriorityOfficialSources();

  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('cardstats:priority-official-evidence'))`;
    let removedArtifacts = 0;

    for (const { definition, response } of fetched) {
      const source = await tx.source.findUniqueOrThrow({ where: { slug: definition.slug } });
      const artifacts = await tx.sourceArtifact.findMany({
        where: { sourceId: source.id, candidateEvidence: { some: {} } },
        orderBy: { observedAt: "asc" },
        include: {
          candidateEvidence: { include: { candidate: { select: { externalKey: true } } } },
          _count: { select: { claimEvidence: true, importRuns: true } },
        },
      });
      if (artifacts.length === 0) throw new Error(`${definition.slug} has no evidence artifact to repair`);

      const expectedFacts = new Map(definition.facts.map((fact) => [fact.fieldKey, fact.displayValue]));
      for (const artifact of artifacts) {
        if (artifact._count.claimEvidence !== 0 || artifact._count.importRuns !== 0) {
          throw new Error(`${definition.slug} artifact ${artifact.id} has unrelated references`);
        }
        if (artifact.candidateEvidence.length !== expectedFacts.size) {
          throw new Error(`${definition.slug} artifact ${artifact.id} does not match the curated evidence set`);
        }
        for (const evidence of artifact.candidateEvidence) {
          if (evidence.candidate.externalKey !== definition.candidateKey || expectedFacts.get(evidence.fieldKey) !== evidence.displayValue) {
            throw new Error(`${definition.slug} artifact ${artifact.id} contains non-equivalent evidence`);
          }
        }
      }

      const normalizedHash = officialContentHash(response.text);
      const canonical = artifacts.find(({ contentHash }) => contentHash === normalizedHash) ?? artifacts[0];
      const duplicateIds = artifacts.filter(({ id }) => id !== canonical.id).map(({ id }) => id);
      if (duplicateIds.length > 0) {
        await tx.discoveryCandidateEvidence.deleteMany({ where: { artifactId: { in: duplicateIds } } });
        await tx.sourceArtifact.deleteMany({ where: { id: { in: duplicateIds } } });
        removedArtifacts += duplicateIds.length;
      }
      await tx.sourceArtifact.update({
        where: { id: canonical.id },
        data: { contentHash: normalizedHash, locator: response.finalUrl, mimeType: response.mimeType },
      });
    }

    return { sourceCount: fetched.length, removedArtifacts };
  }, { isolationLevel: "Serializable", timeout: 30_000 });
}
