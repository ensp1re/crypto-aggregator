import "dotenv/config";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

if (process.env.NODE_ENV === "production") {
  throw new Error("Synthetic seed is disabled in production.");
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString, max: 2, connectionTimeoutMillis: 5_000 }),
});

const effectiveFrom = new Date("2026-07-01T00:00:00.000Z");
const observedAt = new Date("2026-07-12T10:00:00.000Z");
const publishedAt = new Date("2026-07-14T09:00:00.000Z");

async function fixture(path: string) {
  const content = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  return { path, hash: createHash("sha256").update(content).digest("hex") };
}

async function main() {
  const [deFixture, frFixture] = await Promise.all([
    fixture("tests/fixtures/atlas-de-terms.md"),
    fixture("tests/fixtures/atlas-fr-terms.md"),
  ]);

  await prisma.$transaction(async (tx) => {
    await tx.publishedClaim.deleteMany();
    await tx.publicationRevision.deleteMany();
    await tx.reviewEvent.deleteMany();
    await tx.claimEvidence.deleteMany();
    await tx.claim.deleteMany();
    await tx.sourceArtifact.deleteMany();
    await tx.source.deleteMany();
    await tx.plan.deleteMany();
    await tx.cardOffering.deleteMany();
    await tx.cardProgram.deleteMany();
    await tx.organization.deleteMany();
    await tx.actor.deleteMany();

    const researcher = await tx.actor.create({
      data: { email: "researcher@fixture.cardstats.test", displayName: "Rae Researcher", role: "RESEARCHER" },
    });
    const verifier = await tx.actor.create({
      data: { email: "verifier@fixture.cardstats.test", displayName: "Vera Verifier", role: "SENIOR_VERIFIER" },
    });

    const brand = await tx.organization.create({
      data: { slug: "atlas-labs-fixture", name: "Atlas Labs Fixture", type: "BRAND", jurisdictionCode: "DE" },
    });
    const deIssuer = await tx.organization.create({
      data: { slug: "example-eu-payments", name: "Example EU Payments GmbH", type: "ISSUER", jurisdictionCode: "DE" },
    });
    const frIssuer = await tx.organization.create({
      data: { slug: "example-fr-payments", name: "Example France Payments SAS", type: "ISSUER", jurisdictionCode: "FR" },
    });
    const program = await tx.cardProgram.create({
      data: { slug: "atlas-card", name: "Atlas Card", ownerOrganizationId: brand.id },
    });

    const deOffering = await tx.cardOffering.create({
      data: {
        slug: "atlas-card-de",
        programId: program.id,
        issuerId: deIssuer.id,
        label: "Germany offering",
        countryCode: "DE",
        lifecycle: "LIVE",
        cardType: "Prepaid",
        fundingModel: "Crypto converted to EUR before authorization",
        settlementModel: "Prefunded EUR balance",
        baseCurrency: "EUR",
        network: "Visa",
        validFrom: effectiveFrom,
      },
    });
    const frOffering = await tx.cardOffering.create({
      data: {
        slug: "atlas-card-fr",
        programId: program.id,
        issuerId: frIssuer.id,
        label: "France offering",
        countryCode: "FR",
        lifecycle: "LIVE",
        cardType: "Debit",
        fundingModel: "Prefunded EUR account",
        settlementModel: "Direct EUR authorization",
        baseCurrency: "EUR",
        network: "Mastercard",
        validFrom: effectiveFrom,
      },
    });

    const [deSubscription, frSubscription] = await Promise.all([
      tx.planDimension.create({ data: { offeringId: deOffering.id, slug: "subscription", label: "Subscription", kind: "SUBSCRIPTION", displayOrder: 1 } }),
      tx.planDimension.create({ data: { offeringId: frOffering.id, slug: "subscription", label: "Subscription", kind: "SUBSCRIPTION", displayOrder: 1 } }),
    ]);
    const [deCore, dePlus, frCore, frPlus] = await Promise.all([
      tx.plan.create({ data: { slug: "atlas-de-core", offeringId: deOffering.id, dimensionId: deSubscription.id, name: "Core", tierOrder: 1, qualification: "No subscription", lifecycle: "LIVE" } }),
      tx.plan.create({ data: { slug: "atlas-de-plus", offeringId: deOffering.id, dimensionId: deSubscription.id, name: "Plus", tierOrder: 2, qualification: "EUR 9.99 monthly subscription", lifecycle: "LIVE" } }),
      tx.plan.create({ data: { slug: "atlas-fr-core", offeringId: frOffering.id, dimensionId: frSubscription.id, name: "Core", tierOrder: 1, qualification: "No subscription", lifecycle: "LIVE" } }),
      tx.plan.create({ data: { slug: "atlas-fr-plus", offeringId: frOffering.id, dimensionId: frSubscription.id, name: "Plus", tierOrder: 2, qualification: "EUR 7.99 monthly subscription", lifecycle: "LIVE" } }),
    ]);

    const [deSource, frSource] = await Promise.all([
      tx.source.create({ data: { slug: "atlas-de-fixture-terms", title: "Atlas Germany synthetic terms", url: "https://example.invalid/atlas/de/terms", sourceType: "synthetic official terms", authorityTier: "A", rightsStatus: "license-safe fixture", countryCode: "DE" } }),
      tx.source.create({ data: { slug: "atlas-fr-fixture-terms", title: "Atlas France synthetic terms", url: "https://example.invalid/atlas/fr/terms", sourceType: "synthetic official terms", authorityTier: "A", rightsStatus: "license-safe fixture", countryCode: "FR" } }),
    ]);
    const [deArtifact, frArtifact] = await Promise.all([
      tx.sourceArtifact.create({ data: { sourceId: deSource.id, observedAt, contentHash: deFixture.hash, locator: "Synthetic terms list", mimeType: "text/markdown", rightsStatus: "license-safe fixture", fixturePath: deFixture.path } }),
      tx.sourceArtifact.create({ data: { sourceId: frSource.id, observedAt, contentHash: frFixture.hash, locator: "Synthetic terms list", mimeType: "text/markdown", rightsStatus: "license-safe fixture", fixturePath: frFixture.path } }),
    ]);

    const publication = await tx.publicationRevision.create({
      data: { version: 1, summary: "Publish the reviewed Atlas synthetic baseline", publishedAt, publishedById: verifier.id },
    });

    const publish = async (data: {
      offeringId: string;
      planId?: string;
      field: "ELIGIBILITY" | "CARD_TYPE" | "FUNDING_MODEL" | "MONTHLY_FEE" | "FX_FEE" | "ATM_FEE" | "REWARD_RATE" | "REWARD_CAP" | "SPEND_LIMIT";
      valueState?: "KNOWN" | "NOT_DISCLOSED";
      displayValue: string;
      valueJson?: object;
      countryCode: string;
      artifactId: string;
      hash: string;
    }) => {
      const claim = await tx.claim.create({
        data: {
          offeringId: data.offeringId,
          planId: data.planId,
          scopeKey: data.planId ?? "offering",
          field: data.field,
          valueState: data.valueState ?? "KNOWN",
          displayValue: data.displayValue,
          valueJson: data.valueJson,
          countryCode: data.countryCode,
          status: "PUBLISHED",
          effectiveFrom,
          observedAt,
          createdById: researcher.id,
          approvedById: verifier.id,
          publishedAt,
          evidence: { create: { artifactId: data.artifactId, relation: "SUPPORTS", excerptHash: data.hash } },
          planScopes: data.planId ? { create: { planId: data.planId } } : undefined,
          reviewEvents: {
            create: [
              { actorId: researcher.id, action: "SUBMITTED", reason: "Captured from the license-safe synthetic terms fixture." },
              { actorId: verifier.id, action: "APPROVED", reason: "Scope, value state, and fixture locator independently verified." },
              { actorId: verifier.id, action: "PUBLISHED", reason: "Included in the initial synthetic publication revision." },
            ],
          },
        },
      });
      await tx.publishedClaim.create({
        data: {
          claimId: claim.id,
          offeringId: data.offeringId,
          planId: data.planId,
          scopeKey: data.planId ?? "offering",
          field: data.field,
          valueState: data.valueState ?? "KNOWN",
          displayValue: data.displayValue,
          valueJson: data.valueJson,
          countryCode: data.countryCode,
          effectiveFrom,
          observedAt,
          publishedAt,
          publicationRevisionId: publication.id,
          planScopes: data.planId ? { create: { planId: data.planId } } : undefined,
        },
      });
    };

    for (const item of [
      { offeringId: deOffering.id, field: "ELIGIBILITY" as const, displayValue: "Eligible for residents of Germany aged 18+", countryCode: "DE", artifactId: deArtifact.id, hash: deFixture.hash },
      { offeringId: deOffering.id, field: "CARD_TYPE" as const, displayValue: "Prepaid Visa", countryCode: "DE", artifactId: deArtifact.id, hash: deFixture.hash },
      { offeringId: deOffering.id, field: "FUNDING_MODEL" as const, displayValue: "Crypto converts to EUR before authorization", countryCode: "DE", artifactId: deArtifact.id, hash: deFixture.hash },
      { offeringId: deOffering.id, field: "FX_FEE" as const, displayValue: "1%", valueJson: { rate: 1, unit: "percent" }, countryCode: "DE", artifactId: deArtifact.id, hash: deFixture.hash },
      { offeringId: deOffering.id, field: "ATM_FEE" as const, displayValue: "2% after EUR 200/month", valueJson: { rate: 2, freeAllowance: 200, currency: "EUR", period: "month" }, countryCode: "DE", artifactId: deArtifact.id, hash: deFixture.hash },
      { offeringId: deOffering.id, field: "SPEND_LIMIT" as const, displayValue: "EUR 20,000/month", valueJson: { amount: 20000, currency: "EUR", period: "month" }, countryCode: "DE", artifactId: deArtifact.id, hash: deFixture.hash },
      { offeringId: frOffering.id, field: "ELIGIBILITY" as const, displayValue: "Eligible for residents of France aged 18+", countryCode: "FR", artifactId: frArtifact.id, hash: frFixture.hash },
      { offeringId: frOffering.id, field: "CARD_TYPE" as const, displayValue: "Debit Mastercard", countryCode: "FR", artifactId: frArtifact.id, hash: frFixture.hash },
      { offeringId: frOffering.id, field: "FUNDING_MODEL" as const, displayValue: "Prefunded EUR account", countryCode: "FR", artifactId: frArtifact.id, hash: frFixture.hash },
      { offeringId: frOffering.id, field: "FX_FEE" as const, displayValue: "0.8%", valueJson: { rate: 0.8, unit: "percent" }, countryCode: "FR", artifactId: frArtifact.id, hash: frFixture.hash },
      { offeringId: frOffering.id, field: "ATM_FEE" as const, valueState: "NOT_DISCLOSED" as const, displayValue: "Issuer did not disclose", countryCode: "FR", artifactId: frArtifact.id, hash: frFixture.hash },
      { offeringId: frOffering.id, field: "SPEND_LIMIT" as const, displayValue: "EUR 15,000/month", valueJson: { amount: 15000, currency: "EUR", period: "month" }, countryCode: "FR", artifactId: frArtifact.id, hash: frFixture.hash },
    ]) await publish(item);

    for (const item of [
      { offeringId: deOffering.id, planId: deCore.id, countryCode: "DE", artifactId: deArtifact.id, hash: deFixture.hash, monthly: "Verified explicit zero", monthlyJson: { amount: 0, currency: "EUR", period: "month" }, reward: "0.5%", rewardJson: { rate: 0.5, unit: "percent" }, cap: "EUR 10/month", capJson: { amount: 10, currency: "EUR", period: "month" } },
      { offeringId: deOffering.id, planId: dePlus.id, countryCode: "DE", artifactId: deArtifact.id, hash: deFixture.hash, monthly: "EUR 9.99/month", monthlyJson: { amount: 9.99, currency: "EUR", period: "month" }, reward: "2%", rewardJson: { rate: 2, unit: "percent" }, cap: "EUR 50/month", capJson: { amount: 50, currency: "EUR", period: "month" } },
      { offeringId: frOffering.id, planId: frCore.id, countryCode: "FR", artifactId: frArtifact.id, hash: frFixture.hash, monthly: "Verified explicit zero", monthlyJson: { amount: 0, currency: "EUR", period: "month" }, reward: "0.75%", rewardJson: { rate: 0.75, unit: "percent" }, cap: "EUR 12/month", capJson: { amount: 12, currency: "EUR", period: "month" } },
      { offeringId: frOffering.id, planId: frPlus.id, countryCode: "FR", artifactId: frArtifact.id, hash: frFixture.hash, monthly: "EUR 7.99/month", monthlyJson: { amount: 7.99, currency: "EUR", period: "month" }, reward: "1.5%", rewardJson: { rate: 1.5, unit: "percent" }, cap: "EUR 40/month", capJson: { amount: 40, currency: "EUR", period: "month" } },
    ]) {
      await publish({ ...item, field: "MONTHLY_FEE", displayValue: item.monthly, valueJson: item.monthlyJson });
      await publish({ ...item, field: "REWARD_RATE", displayValue: item.reward, valueJson: item.rewardJson });
      await publish({ ...item, field: "REWARD_CAP", displayValue: item.cap, valueJson: item.capJson });
    }

    await tx.claim.create({
      data: {
        offeringId: deOffering.id,
        planId: dePlus.id,
        field: "REWARD_RATE",
        valueState: "KNOWN",
        displayValue: "2.25% from 1 August",
        valueJson: { rate: 2.25, unit: "percent" },
        countryCode: "DE",
        status: "IN_REVIEW",
        effectiveFrom: new Date("2026-08-01T00:00:00.000Z"),
        observedAt,
        createdById: researcher.id,
        evidence: { create: { artifactId: deArtifact.id, relation: "SUPPORTS", excerptHash: deFixture.hash } },
        reviewEvents: { create: { actorId: researcher.id, action: "SUBMITTED", reason: "Synthetic candidate created to exercise independent review and publication." } },
      },
    });
  });

  const [programs, offerings, plans, publishedClaims, candidates] = await Promise.all([
    prisma.cardProgram.count(),
    prisma.cardOffering.count(),
    prisma.plan.count(),
    prisma.publishedClaim.count(),
    prisma.claim.count({ where: { status: "IN_REVIEW" } }),
  ]);
  console.log({ programs, offerings, plans, publishedClaims, candidates });
}

main()
  .finally(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Seed failed");
    process.exit(1);
  });
