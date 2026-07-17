import { describe, expect, it } from "vitest";
import { fetchPaymentScanSeries } from "@/modules/ingestion/paymentscan-client";

describe("PaymentScan licensed connector", () => {
  it("refuses public ingestion without an API key", async () => {
    await expect(fetchPaymentScanSeries({ dataset: "projects", aggregation: "daily" }, {
      apiKey: "",
      republicationLicensed: true,
    })).rejects.toThrow("PAYMENTSCAN_API_KEY");
  });

  it("refuses a valid key without republication rights", async () => {
    await expect(fetchPaymentScanSeries({ dataset: "projects", aggregation: "daily" }, {
      apiKey: "secret",
      republicationLicensed: false,
    })).rejects.toThrow("republication rights");
  });

  it("uses only the documented API when rights are present", async () => {
    let requestedUrl = "";
    let authorization = "";
    const fetcher: typeof fetch = async (input, init) => {
      requestedUrl = String(input);
      authorization = new Headers(init?.headers).get("authorization") ?? "";
      return new Response(JSON.stringify({ data: [{ project: "Example" }], meta: { aggregation: "daily" } }), { status: 200 });
    };
    await fetchPaymentScanSeries({ dataset: "projects", aggregation: "daily", includeTopups: false }, {
      apiKey: "secret",
      republicationLicensed: true,
      fetcher,
    });
    expect(requestedUrl).toBe("https://paymentscan.xyz/api/v1/projects/daily?includeTopups=false");
    expect(authorization).toBe("Bearer secret");
  });
});
