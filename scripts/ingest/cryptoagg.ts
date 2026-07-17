import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { extractCryptoAggCards, fetchCryptoAggDiscovery } from "../../src/modules/ingestion/cryptoagg-adapter";

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const bundlePath = argument("--bundle");
const outputPath = argument("--output");
if (!outputPath) throw new Error("Usage: tsx scripts/ingest/cryptoagg.ts --output <path> [--bundle <local-js>]");

const observedAt = argument("--observed-at") ?? new Date().toISOString();
const result = bundlePath
  ? {
      cards: extractCryptoAggCards(await readFile(resolve(bundlePath), "utf8")),
      homepageUrl: "https://www.cryptoagg.io/",
      bundleUrl: "local-observation",
      observedAt,
    }
  : await fetchCryptoAggDiscovery();

const snapshot = {
  schemaVersion: 1,
  source: {
    title: "CryptoAgg public catalog",
    url: result.homepageUrl,
    bundleUrl: result.bundleUrl,
    observedAt: result.observedAt,
    authority: "competitor-discovery",
    rights: "minimal factual discovery fields only; independent verification required",
  },
  cards: result.cards,
};

await writeFile(resolve(outputPath), `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Wrote ${result.cards.length} discovery candidates to ${outputPath}`);
