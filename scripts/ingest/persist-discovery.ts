import "dotenv/config";
import { prisma } from "../../src/lib/prisma";
import { persistDiscoveryImport } from "../../src/modules/ingestion/persist-discovery";

try {
  const result = await persistDiscoveryImport();
  console.log(`${result.created ? "Created" : "Reused"} quarantined import ${result.runId} with ${result.candidateCount} candidates`);
} finally {
  await prisma.$disconnect();
}
