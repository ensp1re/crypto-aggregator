import { describe, expect, it } from "vitest";
import snapshot from "@/modules/catalog/discovery-snapshot.json";
import { prepareDiscoveryImport } from "@/modules/ingestion/persist-discovery";

describe("discovery import preparation", () => {
  it("creates 42 quarantined candidate payloads with lineage and no publication state", () => {
    const prepared = prepareDiscoveryImport(snapshot);
    expect(prepared.candidates).toHaveLength(42);
    expect(prepared.contentHash).toMatch(/^[a-f0-9]{64}$/);
    expect(new Set(prepared.candidates.map((candidate) => candidate.externalKey)).size).toBe(42);
    expect(prepared.candidates.every((candidate) => candidate.status === "DISCOVERED")).toBe(true);
    expect(prepared.candidates.every((candidate) => candidate.rightsBasis.includes("verification required"))).toBe(true);
  });

  it("rejects a future observation", () => {
    expect(() => prepareDiscoveryImport({
      ...snapshot,
      source: { ...snapshot.source, observedAt: "2999-01-01T00:00:00.000Z" },
    })).toThrow("cannot be in the future");
  });
});
