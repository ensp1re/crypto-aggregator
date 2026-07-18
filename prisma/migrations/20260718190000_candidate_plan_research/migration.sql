BEGIN;

ALTER TYPE "PlanDimensionKind" ADD VALUE 'REWARD_CATEGORY';
ALTER TYPE "PlanDimensionKind" ADD VALUE 'REWARD_OFFER';
ALTER TYPE "PlanDimensionKind" ADD VALUE 'LOYALTY_LEVEL';
ALTER TYPE "PlanDimensionKind" ADD VALUE 'LOYALTY_RANK';

CREATE TYPE "PlanResearchStatus" AS ENUM (
    'STRUCTURED',
    'PARTIAL',
    'NO_PUBLIC_MATRIX',
    'BLOCKED'
);

ALTER TABLE "DiscoveryCandidate"
    ADD COLUMN "planResearchStatus" "PlanResearchStatus" NOT NULL DEFAULT 'NO_PUBLIC_MATRIX',
    ADD COLUMN "planResearchReason" TEXT;

CREATE TABLE "CandidatePlanDimension" (
    "id" UUID NOT NULL,
    "candidateId" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "kind" "PlanDimensionKind" NOT NULL,
    "combinable" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL,
    "observedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "CandidatePlanDimension_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CandidatePlanOption" (
    "id" UUID NOT NULL,
    "dimensionId" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tierOrder" INTEGER NOT NULL,
    "qualification" TEXT,
    "lifecycle" "Lifecycle",
    "displayValue" TEXT NOT NULL,
    "valueJson" JSONB,
    "scopeJson" JSONB NOT NULL,
    "sourceFieldKeys" TEXT[] NOT NULL,
    "observedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "CandidatePlanOption_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CandidatePlanDimension_candidateId_slug_key"
    ON "CandidatePlanDimension"("candidateId", "slug");
CREATE UNIQUE INDEX "CandidatePlanDimension_candidateId_displayOrder_key"
    ON "CandidatePlanDimension"("candidateId", "displayOrder");
CREATE UNIQUE INDEX "CandidatePlanOption_dimensionId_slug_key"
    ON "CandidatePlanOption"("dimensionId", "slug");
CREATE UNIQUE INDEX "CandidatePlanOption_dimensionId_tierOrder_key"
    ON "CandidatePlanOption"("dimensionId", "tierOrder");

ALTER TABLE "CandidatePlanDimension"
    ADD CONSTRAINT "CandidatePlanDimension_candidateId_fkey"
    FOREIGN KEY ("candidateId") REFERENCES "DiscoveryCandidate"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CandidatePlanOption"
    ADD CONSTRAINT "CandidatePlanOption_dimensionId_fkey"
    FOREIGN KEY ("dimensionId") REFERENCES "CandidatePlanDimension"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
