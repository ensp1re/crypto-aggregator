import { parse } from "acorn";
import { z } from "zod";

const HOME_URL = new URL("https://www.cryptoagg.io/");
const MAX_HTML_BYTES = 2_000_000;
const MAX_BUNDLE_BYTES = 5_000_000;

export const cryptoAggDiscoveryCardSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  issuer: z.string().min(1),
  logo: z.string().url(),
  type: z.string().min(1),
  network: z.string().min(1),
  cashbackMax: z.union([z.number().nonnegative(), z.string().min(1), z.null()]),
  annualFee: z.string().min(1),
  fxFee: z.string().min(1),
  custody: z.string().min(1),
  regions: z.string().min(1),
  officialLink: z.string().url(),
  metal: z.boolean(),
  stakingRequired: z.string().min(1),
  atmLimit: z.string().min(1),
  mobilePay: z.boolean(),
  supportedAssets: z.string().min(1),
  kyc: z.string().min(1),
  supportedCurrencies: z.array(z.string().min(1)),
});

export type CryptoAggDiscoveryCard = z.infer<typeof cryptoAggDiscoveryCardSchema>;

type AstNode = { type: string; [key: string]: unknown };

function isNode(value: unknown): value is AstNode {
  return typeof value === "object" && value !== null && "type" in value && typeof value.type === "string";
}

function propertyKey(node: AstNode): string {
  if (node.type === "Identifier" && typeof node.name === "string") return node.name;
  if (node.type === "Literal" && typeof node.value === "string") return node.value;
  throw new Error(`Unsupported object key node: ${node.type}`);
}

function evaluateLiteral(node: AstNode): unknown {
  if (node.type === "Literal") return node.value;

  if (node.type === "UnaryExpression" && node.operator === "!" && isNode(node.argument)) {
    return !evaluateLiteral(node.argument);
  }

  if (node.type === "ArrayExpression" && Array.isArray(node.elements)) {
    return node.elements.map((element) => {
      if (!isNode(element)) throw new Error("Sparse arrays are unsupported");
      return evaluateLiteral(element);
    });
  }

  if (node.type === "ObjectExpression" && Array.isArray(node.properties)) {
    const entries = node.properties.map((property) => {
      if (!isNode(property) || property.type !== "Property" || property.kind !== "init" || property.computed) {
        throw new Error("Only plain object properties are supported");
      }
      if (!isNode(property.key) || !isNode(property.value)) throw new Error("Invalid object property");
      return [propertyKey(property.key), evaluateLiteral(property.value)] as const;
    });
    return Object.fromEntries(entries);
  }

  if (
    node.type === "CallExpression" &&
    isNode(node.callee) &&
    node.callee.type === "Identifier" &&
    node.callee.name === "K" &&
    Array.isArray(node.arguments) &&
    node.arguments.length === 1 &&
    isNode(node.arguments[0])
  ) {
    const handle = evaluateLiteral(node.arguments[0]);
    if (typeof handle !== "string") throw new Error("Issuer mark handle must be a string");
    return `https://unavatar.io/twitter/${handle}`;
  }

  throw new Error(`Unsupported executable node: ${node.type}`);
}

function walk(root: AstNode, visit: (node: AstNode) => void) {
  visit(root);
  for (const value of Object.values(root)) {
    if (Array.isArray(value)) {
      for (const child of value) if (isNode(child)) walk(child, visit);
    } else if (isNode(value)) {
      walk(value, visit);
    }
  }
}

export function extractCryptoAggCards(bundle: string): CryptoAggDiscoveryCard[] {
  if (Buffer.byteLength(bundle, "utf8") > MAX_BUNDLE_BYTES) throw new Error("CryptoAgg bundle exceeds byte limit");

  const ast = parse(bundle, { ecmaVersion: "latest", sourceType: "module" }) as unknown as AstNode;
  let extracted: unknown;

  walk(ast, (node) => {
    if (extracted || node.type !== "VariableDeclarator" || !isNode(node.init) || node.init.type !== "ArrayExpression") return;
    try {
      const value = evaluateLiteral(node.init);
      if (!Array.isArray(value) || value.length < 20) return;
      const sample = value[0];
      if (typeof sample !== "object" || sample === null || !("officialLink" in sample) || !("custody" in sample)) return;
      extracted = value;
    } catch {
      // Most arrays in the compiled application contain executable expressions; ignore them.
    }
  });

  if (!extracted) throw new Error("CryptoAgg card array was not found");
  return z.array(cryptoAggDiscoveryCardSchema).min(20).max(250).parse(extracted);
}

async function readLimited(response: Response, maxBytes: number): Promise<string> {
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
  const text = await response.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) throw new Error("Source response exceeds byte limit");
  return text;
}

function discoverBundleUrl(html: string): URL {
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+\.js)["'][^>]*>/gi)];
  for (const match of scripts.reverse()) {
    const url = new URL(match[1], HOME_URL);
    if (url.origin === HOME_URL.origin && url.pathname.startsWith("/assets/")) return url;
  }
  throw new Error("CryptoAgg application bundle was not found");
}

export async function fetchCryptoAggDiscovery(fetcher: typeof fetch = fetch): Promise<{
  cards: CryptoAggDiscoveryCard[];
  homepageUrl: string;
  bundleUrl: string;
  observedAt: string;
}> {
  const request = { redirect: "error" as const, signal: AbortSignal.timeout(15_000) };
  const html = await readLimited(await fetcher(HOME_URL, request), MAX_HTML_BYTES);
  const bundleUrl = discoverBundleUrl(html);
  const bundle = await readLimited(await fetcher(bundleUrl, request), MAX_BUNDLE_BYTES);
  return {
    cards: extractCryptoAggCards(bundle),
    homepageUrl: HOME_URL.href,
    bundleUrl: bundleUrl.href,
    observedAt: new Date().toISOString(),
  };
}
