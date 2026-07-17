CREATE TYPE "ImportRunStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED', 'QUARANTINED');
CREATE TYPE "CandidateStatus" AS ENUM ('DISCOVERED', 'TRIAGED', 'VERIFYING', 'PROMOTED', 'REJECTED');

CREATE TABLE "SourceImportRun" (
    "id" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "artifactId" UUID,
    "status" "ImportRunStatus" NOT NULL DEFAULT 'RUNNING',
    "collector" TEXT NOT NULL,
    "collectorVersion" TEXT NOT NULL,
    "startedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMPTZ(3),
    "observedCount" INTEGER NOT NULL DEFAULT 0,
    "acceptedCount" INTEGER NOT NULL DEFAULT 0,
    "errorCode" TEXT,
    CONSTRAINT "SourceImportRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DiscoveryCandidate" (
    "id" UUID NOT NULL,
    "importRunId" UUID NOT NULL,
    "externalKey" TEXT NOT NULL,
    "canonicalHint" TEXT NOT NULL,
    "issuerHint" TEXT NOT NULL,
    "officialUrl" TEXT,
    "observation" JSONB NOT NULL,
    "status" "CandidateStatus" NOT NULL DEFAULT 'DISCOVERED',
    "rightsBasis" TEXT NOT NULL,
    "discoveredAt" TIMESTAMPTZ(3) NOT NULL,
    "reviewedAt" TIMESTAMPTZ(3),
    "reviewReason" TEXT,
    CONSTRAINT "DiscoveryCandidate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MarketMetricSeries" (
    "id" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "aggregation" TEXT NOT NULL,
    "eventDefinition" TEXT NOT NULL,
    "observationBasis" TEXT NOT NULL,
    "includesTopups" BOOLEAN NOT NULL,
    "includesOffchainData" BOOLEAN NOT NULL,
    "coverageJson" JSONB NOT NULL,
    "methodVersion" TEXT NOT NULL,
    "licenseBasis" TEXT NOT NULL,
    "publicationAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MarketMetricSeries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MarketMetricPoint" (
    "id" UUID NOT NULL,
    "seriesId" UUID NOT NULL,
    "periodStart" DATE NOT NULL,
    "value" DECIMAL(30,8) NOT NULL,
    "partial" BOOLEAN NOT NULL DEFAULT false,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "observedAt" TIMESTAMPTZ(3) NOT NULL,
    "metadata" JSONB,
    CONSTRAINT "MarketMetricPoint_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SourceImportRun_sourceId_startedAt_idx" ON "SourceImportRun"("sourceId", "startedAt");
CREATE INDEX "SourceImportRun_status_startedAt_idx" ON "SourceImportRun"("status", "startedAt");
CREATE UNIQUE INDEX "DiscoveryCandidate_importRunId_externalKey_key" ON "DiscoveryCandidate"("importRunId", "externalKey");
CREATE INDEX "DiscoveryCandidate_status_canonicalHint_idx" ON "DiscoveryCandidate"("status", "canonicalHint");
CREATE UNIQUE INDEX "MarketMetricSeries_slug_key" ON "MarketMetricSeries"("slug");
CREATE INDEX "MarketMetricSeries_sourceId_publicationAllowed_idx" ON "MarketMetricSeries"("sourceId", "publicationAllowed");
CREATE UNIQUE INDEX "MarketMetricPoint_seriesId_periodStart_revision_key" ON "MarketMetricPoint"("seriesId", "periodStart", "revision");
CREATE INDEX "MarketMetricPoint_seriesId_periodStart_idx" ON "MarketMetricPoint"("seriesId", "periodStart");

ALTER TABLE "SourceImportRun" ADD CONSTRAINT "SourceImportRun_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SourceImportRun" ADD CONSTRAINT "SourceImportRun_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "SourceArtifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DiscoveryCandidate" ADD CONSTRAINT "DiscoveryCandidate_importRunId_fkey" FOREIGN KEY ("importRunId") REFERENCES "SourceImportRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MarketMetricSeries" ADD CONSTRAINT "MarketMetricSeries_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MarketMetricPoint" ADD CONSTRAINT "MarketMetricPoint_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "MarketMetricSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
