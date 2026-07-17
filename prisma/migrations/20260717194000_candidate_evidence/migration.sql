CREATE TABLE "DiscoveryCandidateEvidence" (
    "candidateId" UUID NOT NULL,
    "artifactId" UUID NOT NULL,
    "fieldKey" TEXT NOT NULL,
    "relation" "EvidenceRelation" NOT NULL DEFAULT 'SUPPORTS',
    "excerptHash" TEXT NOT NULL,
    "displayValue" TEXT NOT NULL,
    "valueJson" JSONB,
    "scopeJson" JSONB NOT NULL,
    "observedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "DiscoveryCandidateEvidence_pkey" PRIMARY KEY ("candidateId", "artifactId", "fieldKey")
);

CREATE INDEX "DiscoveryCandidateEvidence_candidateId_fieldKey_idx" ON "DiscoveryCandidateEvidence"("candidateId", "fieldKey");

ALTER TABLE "DiscoveryCandidateEvidence" ADD CONSTRAINT "DiscoveryCandidateEvidence_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "DiscoveryCandidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DiscoveryCandidateEvidence" ADD CONSTRAINT "DiscoveryCandidateEvidence_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "SourceArtifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
