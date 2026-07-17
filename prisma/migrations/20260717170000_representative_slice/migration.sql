-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ActorRole" AS ENUM ('RESEARCHER', 'SENIOR_VERIFIER', 'ADMINISTRATOR', 'COMMERCIAL_OPERATOR');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('BRAND', 'ISSUER', 'NETWORK', 'PROGRAM_MANAGER');

-- CreateEnum
CREATE TYPE "Lifecycle" AS ENUM ('LIVE', 'WAITLIST', 'PAUSED', 'SUNSET');

-- CreateEnum
CREATE TYPE "ValueState" AS ENUM ('KNOWN', 'NOT_OFFERED', 'NOT_DISCLOSED', 'NOT_APPLICABLE', 'CONFLICTING', 'STALE');

-- CreateEnum
CREATE TYPE "ClaimField" AS ENUM ('ELIGIBILITY', 'CARD_TYPE', 'FUNDING_MODEL', 'ISSUANCE_FEE', 'MONTHLY_FEE', 'FX_FEE', 'ATM_FEE', 'REWARD_RATE', 'REWARD_CAP', 'SPEND_LIMIT');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('CANDIDATE', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ReviewAction" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "AuthorityTier" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "EvidenceRelation" AS ENUM ('SUPPORTS', 'CONTRADICTS');

-- CreateTable
CREATE TABLE "Actor" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "role" "ActorRole" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "jurisdictionCode" VARCHAR(2),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardProgram" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerOrganizationId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardOffering" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "programId" UUID NOT NULL,
    "issuerId" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "lifecycle" "Lifecycle" NOT NULL,
    "cardType" TEXT NOT NULL,
    "fundingModel" TEXT NOT NULL,
    "settlementModel" TEXT NOT NULL,
    "baseCurrency" VARCHAR(3) NOT NULL,
    "network" TEXT NOT NULL,
    "validFrom" DATE NOT NULL,
    "validTo" DATE,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "offeringId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "tierOrder" INTEGER NOT NULL,
    "qualification" TEXT NOT NULL,
    "lifecycle" "Lifecycle" NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "authorityTier" "AuthorityTier" NOT NULL,
    "rightsStatus" TEXT NOT NULL,
    "countryCode" VARCHAR(2),

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceArtifact" (
    "id" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "observedAt" TIMESTAMPTZ(3) NOT NULL,
    "contentHash" TEXT NOT NULL,
    "locator" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "rightsStatus" TEXT NOT NULL,
    "fixturePath" TEXT,

    CONSTRAINT "SourceArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" UUID NOT NULL,
    "offeringId" UUID NOT NULL,
    "planId" UUID,
    "field" "ClaimField" NOT NULL,
    "valueState" "ValueState" NOT NULL,
    "displayValue" TEXT NOT NULL,
    "valueJson" JSONB,
    "countryCode" VARCHAR(2) NOT NULL,
    "critical" BOOLEAN NOT NULL DEFAULT true,
    "status" "ClaimStatus" NOT NULL DEFAULT 'CANDIDATE',
    "effectiveFrom" DATE NOT NULL,
    "effectiveTo" DATE,
    "observedAt" TIMESTAMPTZ(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "approvedById" UUID,
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimEvidence" (
    "claimId" UUID NOT NULL,
    "artifactId" UUID NOT NULL,
    "relation" "EvidenceRelation" NOT NULL DEFAULT 'SUPPORTS',
    "excerptHash" TEXT NOT NULL,

    CONSTRAINT "ClaimEvidence_pkey" PRIMARY KEY ("claimId","artifactId")
);

-- CreateTable
CREATE TABLE "ReviewEvent" (
    "id" UUID NOT NULL,
    "claimId" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "action" "ReviewAction" NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationRevision" (
    "id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "publishedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedById" UUID NOT NULL,

    CONSTRAINT "PublicationRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedClaim" (
    "id" UUID NOT NULL,
    "claimId" UUID NOT NULL,
    "offeringId" UUID NOT NULL,
    "planId" UUID,
    "field" "ClaimField" NOT NULL,
    "valueState" "ValueState" NOT NULL,
    "displayValue" TEXT NOT NULL,
    "valueJson" JSONB,
    "countryCode" VARCHAR(2) NOT NULL,
    "effectiveFrom" DATE NOT NULL,
    "effectiveTo" DATE,
    "observedAt" TIMESTAMPTZ(3) NOT NULL,
    "publishedAt" TIMESTAMPTZ(3) NOT NULL,
    "publicationRevisionId" UUID NOT NULL,

    CONSTRAINT "PublishedClaim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Actor_email_key" ON "Actor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CardProgram_slug_key" ON "CardProgram"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CardOffering_slug_key" ON "CardOffering"("slug");

-- CreateIndex
CREATE INDEX "CardOffering_countryCode_lifecycle_idx" ON "CardOffering"("countryCode", "lifecycle");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_slug_key" ON "Plan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_offeringId_tierOrder_key" ON "Plan"("offeringId", "tierOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Source_slug_key" ON "Source"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SourceArtifact_contentHash_key" ON "SourceArtifact"("contentHash");

-- CreateIndex
CREATE INDEX "Claim_offeringId_planId_field_status_idx" ON "Claim"("offeringId", "planId", "field", "status");

-- CreateIndex
CREATE INDEX "Claim_countryCode_status_effectiveTo_idx" ON "Claim"("countryCode", "status", "effectiveTo");

-- CreateIndex
CREATE INDEX "ReviewEvent_claimId_createdAt_idx" ON "ReviewEvent"("claimId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationRevision_version_key" ON "PublicationRevision"("version");

-- CreateIndex
CREATE UNIQUE INDEX "PublishedClaim_claimId_key" ON "PublishedClaim"("claimId");

-- CreateIndex
CREATE INDEX "PublishedClaim_offeringId_planId_field_idx" ON "PublishedClaim"("offeringId", "planId", "field");

-- CreateIndex
CREATE INDEX "PublishedClaim_countryCode_field_idx" ON "PublishedClaim"("countryCode", "field");

-- AddForeignKey
ALTER TABLE "CardProgram" ADD CONSTRAINT "CardProgram_ownerOrganizationId_fkey" FOREIGN KEY ("ownerOrganizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardOffering" ADD CONSTRAINT "CardOffering_programId_fkey" FOREIGN KEY ("programId") REFERENCES "CardProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardOffering" ADD CONSTRAINT "CardOffering_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "CardOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceArtifact" ADD CONSTRAINT "SourceArtifact_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "CardOffering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Actor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Actor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimEvidence" ADD CONSTRAINT "ClaimEvidence_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimEvidence" ADD CONSTRAINT "ClaimEvidence_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "SourceArtifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewEvent" ADD CONSTRAINT "ReviewEvent_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewEvent" ADD CONSTRAINT "ReviewEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationRevision" ADD CONSTRAINT "PublicationRevision_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "Actor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedClaim" ADD CONSTRAINT "PublishedClaim_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedClaim" ADD CONSTRAINT "PublishedClaim_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "CardOffering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedClaim" ADD CONSTRAINT "PublishedClaim_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedClaim" ADD CONSTRAINT "PublishedClaim_publicationRevisionId_fkey" FOREIGN KEY ("publicationRevisionId") REFERENCES "PublicationRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Reviewed PostgreSQL-native integrity constraints that Prisma Schema Language cannot fully express.
ALTER TABLE "CardOffering"
    ADD CONSTRAINT "CardOffering_valid_range_check" CHECK ("validTo" IS NULL OR "validTo" > "validFrom"),
    ADD CONSTRAINT "CardOffering_country_code_check" CHECK ("countryCode" ~ '^[A-Z]{2}$'),
    ADD CONSTRAINT "CardOffering_currency_code_check" CHECK ("baseCurrency" ~ '^[A-Z]{3}$');

ALTER TABLE "Claim"
    ADD CONSTRAINT "Claim_effective_range_check" CHECK ("effectiveTo" IS NULL OR "effectiveTo" > "effectiveFrom"),
    ADD CONSTRAINT "Claim_country_code_check" CHECK ("countryCode" ~ '^[A-Z]{2}$'),
    ADD CONSTRAINT "Claim_separate_approver_check" CHECK ("approvedById" IS NULL OR "approvedById" <> "createdById"),
    ADD CONSTRAINT "Claim_approval_state_check" CHECK (
        ("status" IN ('APPROVED', 'PUBLISHED') AND "approvedById" IS NOT NULL)
        OR "status" NOT IN ('APPROVED', 'PUBLISHED')
    ),
    ADD CONSTRAINT "Claim_publication_state_check" CHECK (
        ("status" = 'PUBLISHED' AND "publishedAt" IS NOT NULL)
        OR ("status" <> 'PUBLISHED' AND "publishedAt" IS NULL)
    );

ALTER TABLE "PublishedClaim"
    ADD CONSTRAINT "PublishedClaim_effective_range_check" CHECK ("effectiveTo" IS NULL OR "effectiveTo" > "effectiveFrom"),
    ADD CONSTRAINT "PublishedClaim_country_code_check" CHECK ("countryCode" ~ '^[A-Z]{2}$');

CREATE UNIQUE INDEX "Plan_id_offeringId_key" ON "Plan"("id", "offeringId");

ALTER TABLE "Claim"
    ADD CONSTRAINT "Claim_plan_offering_fkey" FOREIGN KEY ("planId", "offeringId")
    REFERENCES "Plan"("id", "offeringId") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PublishedClaim"
    ADD CONSTRAINT "PublishedClaim_plan_offering_fkey" FOREIGN KEY ("planId", "offeringId")
    REFERENCES "Plan"("id", "offeringId") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE UNIQUE INDEX "PublishedClaim_current_scope_key"
    ON "PublishedClaim"(
        "offeringId",
        COALESCE("planId", '00000000-0000-0000-0000-000000000000'::uuid),
        "field",
        "countryCode"
    );
