import { z } from "zod";

const API_ORIGIN = "https://paymentscan.xyz";

const responseSchema = z.object({
  data: z.array(z.record(z.string(), z.unknown())),
  meta: z.object({
    aggregation: z.string().optional(),
    cachedAt: z.string().optional(),
  }).passthrough(),
}).passthrough();

export type PaymentScanDataset = "projects" | "chains" | "currencies" | "networks" | "infra";
export type PaymentScanAggregation = "daily" | "weekly" | "monthly";

export type PaymentScanRequest = {
  dataset: PaymentScanDataset;
  aggregation: PaymentScanAggregation;
  includeTopups?: boolean;
  includeOffchainData?: boolean;
};

export async function fetchPaymentScanSeries(
  request: PaymentScanRequest,
  options: { apiKey?: string; republicationLicensed?: boolean; fetcher?: typeof fetch } = {},
) {
  const apiKey = options.apiKey ?? process.env.PAYMENTSCAN_API_KEY;
  const republicationLicensed = options.republicationLicensed ?? process.env.PAYMENTSCAN_REPUBLICATION_LICENSED === "true";

  if (!apiKey) throw new Error("PAYMENTSCAN_API_KEY is required for licensed PaymentScan data");
  if (!republicationLicensed) {
    throw new Error("PaymentScan data cannot enter a public projection without documented republication rights");
  }

  const url = new URL(`/api/v1/${request.dataset}/${request.aggregation}`, API_ORIGIN);
  if (request.includeTopups !== undefined) url.searchParams.set("includeTopups", String(request.includeTopups));
  if (request.includeOffchainData !== undefined) url.searchParams.set("includeOffchainData", String(request.includeOffchainData));

  const response = await (options.fetcher ?? fetch)(url, {
    headers: { authorization: `Bearer ${apiKey}`, accept: "application/json" },
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`PaymentScan API returned HTTP ${response.status}`);
  return responseSchema.parse(await response.json());
}
