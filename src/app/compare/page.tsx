import type { Metadata } from "next";
import { ComparePicker } from "@/components/compare-picker";
import { ComparisonTable } from "@/components/comparison-table";
import { MAX_COMPARE_CARDS } from "@/modules/catalog/comparison";
import { getCompareOptions, resolveComparisonCards } from "@/modules/catalog/comparison-server";

export const metadata: Metadata = { title: "Compare crypto cards", description: "Compare real crypto-card discovery observations without hiding verification gaps." };

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ cards?: string | string[] }> }) {
  const cards = resolveComparisonCards((await searchParams).cards);
  const compareOptions = getCompareOptions();
  const selectedSlugs = cards.map((card) => card.slug);
  return (
    <div className="shell page-stack compare-page">
      <header className="editorial-header"><div><p className="kicker">Side-by-side / discovery data</p><h1>Selected cards, without a fake winner.</h1></div><p>Compare how each program is described, then confirm every consequential term with the issuer. Shared region and scenario logic will follow official verification.</p></header>
      {cards.length >= 2 ? <>
        <div className="compare-selection-bar">
          <p><strong>{cards.length} selected</strong><span>Up to four on desktop and three when starting on mobile.</span></p>
          {cards.length < MAX_COMPARE_CARDS ? <ComparePicker cards={compareOptions} initialSelected={selectedSlugs} buttonLabel="Add or change cards" /> : <span className="compare-limit">Four-card limit reached</span>}
        </div>
        <section className="compare-scope" aria-labelledby="compare-scope-title"><p className="kicker">Scope boundary</p><h2 id="compare-scope-title">Regional offerings are not normalized yet.</h2><p>Reported regions travel with each card below. CardStats will not infer shared eligibility or rank mismatched offerings until official review is complete.</p></section>
        <ComparisonTable cards={cards} />
      </> : <section className="compare-empty" aria-labelledby="compare-empty-title">
        <p className="kicker">Start a comparison</p>
        <h2 id="compare-empty-title">Select at least two programs.</h2>
        <p>Choose the cards you want to inspect. No program is preselected or commercially preferred.</p>
        <ComparePicker cards={compareOptions} initialSelected={selectedSlugs} buttonLabel={cards.length === 1 ? "Add another card" : "Choose cards"} buttonClassName="button primary" />
      </section>}
      <section className="method-strip"><p className="kicker">Why no ranking?</p><h2>Eligibility and verified economics come first.</h2><p>The source does not model regional legal offerings or consistently separate headline rewards from base rewards, caps, staking, and exclusions. Ranking this data would manufacture confidence, so CardStats does not.</p></section>
    </div>
  );
}
