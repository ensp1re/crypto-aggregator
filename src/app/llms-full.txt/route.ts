import { agentCatalogMarkdown, buildAgentCatalog } from "@/lib/agent-catalog";
import { getDiscoverySnapshot } from "@/modules/catalog/discovery";

export const revalidate = 86_400;

export async function GET() {
  const catalog = buildAgentCatalog(await getDiscoverySnapshot());
  return new Response(agentCatalogMarkdown(catalog), {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
