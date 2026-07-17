import "dotenv/config";
import { prisma } from "../../src/lib/prisma";
import {
  collectPriorityOfficialEvidence,
  fetchPriorityOfficialSources,
  repairLegacyOfficialArtifactHashes,
} from "../../src/modules/verification/collect-priority-official";

try {
  if (process.argv.includes("--repair-legacy-hashes")) {
    const result = await repairLegacyOfficialArtifactHashes();
    console.log(`Reconciled ${result.sourceCount} official sources and removed ${result.removedArtifacts} duplicate artifacts`);
  } else if (process.argv.includes("--dry-run")) {
    const fetched = await fetchPriorityOfficialSources();
    const evidenceCount = fetched.reduce((total, item) => total + item.definition.facts.length, 0);
    console.log(`Validated ${evidenceCount} field observations from ${fetched.length} official sources without database writes`);
  } else {
    const result = await collectPriorityOfficialEvidence();
    console.log(`Collected ${result.evidenceCount} field observations from ${result.sourceCount} official sources for ${result.candidateCount} candidates`);
  }
} finally {
  await prisma.$disconnect();
}
