-- Expand the fact vocabulary so fees, rewards, benefits, and time-bound promotions
-- remain separate evidence-backed claims rather than prose embedded in a card row.
BEGIN;

CREATE TYPE "PlanDimensionKind" AS ENUM (
    'CARD_PLAN',
    'SUBSCRIPTION',
    'MEMBERSHIP_LEVEL',
    'REWARD_TIER',
    'LOYALTY_TIER',
    'VERIFICATION_LEVEL',
    'ACCOUNT_TIER',
    'CARD_MODE'
);

ALTER TYPE "ClaimField" ADD VALUE 'NETWORK';
ALTER TYPE "ClaimField" ADD VALUE 'SUPPORTED_ASSETS';
ALTER TYPE "ClaimField" ADD VALUE 'KYC';
ALTER TYPE "ClaimField" ADD VALUE 'SHIPPING_FEE';
ALTER TYPE "ClaimField" ADD VALUE 'ANNUAL_FEE';
ALTER TYPE "ClaimField" ADD VALUE 'TOP_UP_FEE';
ALTER TYPE "ClaimField" ADD VALUE 'CONVERSION_FEE';
ALTER TYPE "ClaimField" ADD VALUE 'ATM_LIMIT';
ALTER TYPE "ClaimField" ADD VALUE 'REWARD_CURRENCY';
ALTER TYPE "ClaimField" ADD VALUE 'REWARD_QUALIFICATION';
ALTER TYPE "ClaimField" ADD VALUE 'MOBILE_WALLET';
ALTER TYPE "ClaimField" ADD VALUE 'BENEFIT';
ALTER TYPE "ClaimField" ADD VALUE 'PROMOTION';

CREATE TABLE "PlanDimension" (
    "id" UUID NOT NULL,
    "offeringId" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "kind" "PlanDimensionKind" NOT NULL,
    "combinable" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlanDimension_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Plan" ADD COLUMN "dimensionId" UUID;
ALTER TABLE "Claim"
    ADD COLUMN "subjectKey" VARCHAR(160) NOT NULL DEFAULT 'default',
    ADD COLUMN "scopeKey" VARCHAR(500) NOT NULL DEFAULT 'offering';
ALTER TABLE "PublishedClaim"
    ADD COLUMN "subjectKey" VARCHAR(160) NOT NULL DEFAULT 'default',
    ADD COLUMN "scopeKey" VARCHAR(500) NOT NULL DEFAULT 'offering';

-- Preserve every existing plan by placing it in a single legacy dimension for
-- its offering. The deterministic UUID avoids an extension dependency.
INSERT INTO "PlanDimension" (
    "id", "offeringId", "slug", "label", "kind", "combinable", "displayOrder"
)
SELECT
    md5('cardstats-plan-dimension:' || offering."id"::text)::uuid,
    offering."id",
    'legacy-plan',
    'Plan',
    'CARD_PLAN'::"PlanDimensionKind",
    false,
    1
FROM "CardOffering" AS offering
WHERE EXISTS (
    SELECT 1 FROM "Plan" AS plan WHERE plan."offeringId" = offering."id"
);

UPDATE "Plan" AS plan
SET "dimensionId" = dimension."id"
FROM "PlanDimension" AS dimension
WHERE dimension."offeringId" = plan."offeringId"
  AND dimension."slug" = 'legacy-plan';

ALTER TABLE "Plan" ALTER COLUMN "dimensionId" SET NOT NULL;

UPDATE "Claim" AS claim
SET "scopeKey" = plan."slug"
FROM "Plan" AS plan
WHERE claim."planId" = plan."id";

UPDATE "PublishedClaim" AS claim
SET "scopeKey" = plan."slug"
FROM "Plan" AS plan
WHERE claim."planId" = plan."id";

DROP INDEX "Plan_offeringId_tierOrder_key";
DROP INDEX "PublishedClaim_current_scope_key";

CREATE UNIQUE INDEX "PlanDimension_offeringId_slug_key"
    ON "PlanDimension"("offeringId", "slug");
CREATE UNIQUE INDEX "PlanDimension_id_offeringId_key"
    ON "PlanDimension"("id", "offeringId");
CREATE UNIQUE INDEX "PlanDimension_offeringId_displayOrder_key"
    ON "PlanDimension"("offeringId", "displayOrder");
CREATE UNIQUE INDEX "Plan_dimensionId_tierOrder_key"
    ON "Plan"("dimensionId", "tierOrder");
CREATE UNIQUE INDEX "Claim_id_offeringId_key"
    ON "Claim"("id", "offeringId");
CREATE UNIQUE INDEX "PublishedClaim_id_offeringId_key"
    ON "PublishedClaim"("id", "offeringId");
CREATE UNIQUE INDEX "PublishedClaim_current_scope_key"
    ON "PublishedClaim"(
        "offeringId",
        "scopeKey",
        "field",
        "subjectKey",
        "countryCode"
    );

CREATE TABLE "ClaimPlanScope" (
    "claimId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "offeringId" UUID NOT NULL,
    CONSTRAINT "ClaimPlanScope_pkey" PRIMARY KEY ("claimId", "planId")
);

CREATE TABLE "PublishedClaimPlanScope" (
    "publishedClaimId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "offeringId" UUID NOT NULL,
    CONSTRAINT "PublishedClaimPlanScope_pkey" PRIMARY KEY ("publishedClaimId", "planId")
);

-- Mirror the legacy singular plan relation into the composable scope tables.
INSERT INTO "ClaimPlanScope" ("claimId", "planId", "offeringId")
SELECT "id", "planId", "offeringId"
FROM "Claim"
WHERE "planId" IS NOT NULL;

INSERT INTO "PublishedClaimPlanScope" ("publishedClaimId", "planId", "offeringId")
SELECT "id", "planId", "offeringId"
FROM "PublishedClaim"
WHERE "planId" IS NOT NULL;

CREATE INDEX "ClaimPlanScope_planId_idx" ON "ClaimPlanScope"("planId");
CREATE INDEX "PublishedClaimPlanScope_planId_idx" ON "PublishedClaimPlanScope"("planId");

ALTER TABLE "PlanDimension"
    ADD CONSTRAINT "PlanDimension_offeringId_fkey"
    FOREIGN KEY ("offeringId") REFERENCES "CardOffering"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Plan"
    ADD CONSTRAINT "Plan_dimensionId_offeringId_fkey"
    FOREIGN KEY ("dimensionId", "offeringId") REFERENCES "PlanDimension"("id", "offeringId")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClaimPlanScope"
    ADD CONSTRAINT "ClaimPlanScope_claimId_offeringId_fkey"
    FOREIGN KEY ("claimId", "offeringId") REFERENCES "Claim"("id", "offeringId")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClaimPlanScope"
    ADD CONSTRAINT "ClaimPlanScope_planId_offeringId_fkey"
    FOREIGN KEY ("planId", "offeringId") REFERENCES "Plan"("id", "offeringId")
    ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PublishedClaimPlanScope"
    ADD CONSTRAINT "PublishedClaimPlanScope_publishedClaimId_offeringId_fkey"
    FOREIGN KEY ("publishedClaimId", "offeringId") REFERENCES "PublishedClaim"("id", "offeringId")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PublishedClaimPlanScope"
    ADD CONSTRAINT "PublishedClaimPlanScope_planId_offeringId_fkey"
    FOREIGN KEY ("planId", "offeringId") REFERENCES "Plan"("id", "offeringId")
    ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
