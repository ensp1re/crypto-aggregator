export const MAX_COMPARE_CARDS = 4;

export type CompareOption = {
  slug: string;
  name: string;
  issuer: string;
  regions: string;
  custody: string;
  network: string;
};

export function normalizeComparisonSlugs(
  raw: string | string[] | undefined,
  availableSlugs: readonly string[],
  limit = MAX_COMPARE_CARDS,
) {
  const requested = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const available = new Set(availableSlugs.map((slug) => slug.toLowerCase()));
  const selected: string[] = [];

  for (const candidate of requested) {
    const slug = candidate.trim().toLowerCase();
    if (!slug || selected.includes(slug) || !available.has(slug)) continue;
    selected.push(slug);
    if (selected.length === limit) break;
  }

  return selected;
}

export function comparisonHref(slugs: readonly string[], plans: Readonly<Record<string, string>> = {}) {
  const params = new URLSearchParams();
  for (const slug of slugs) params.append("cards", slug);
  for (const slug of slugs) {
    for (const [key, option] of Object.entries(plans)) {
      if (!key.startsWith(`${slug}.`) || !option) continue;
      params.append("plans", `${slug}:${key.slice(slug.length + 1)}:${option}`);
    }
  }
  const query = params.toString();
  return query ? `/compare?${query}` : "/compare";
}
