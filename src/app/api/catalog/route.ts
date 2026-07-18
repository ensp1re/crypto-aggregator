import { NextResponse } from "next/server";
import { buildAgentCatalog } from "@/lib/agent-catalog";
import { getDiscoverySnapshot } from "@/modules/catalog/discovery";

export const revalidate = 86_400;

export async function GET() {
  const catalog = buildAgentCatalog(await getDiscoverySnapshot());
  return NextResponse.json(catalog, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
