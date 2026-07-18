import type { Metadata } from "next";
import { ComparePicker } from "@/components/compare-picker";
import { ComparisonTable } from "@/components/comparison-table";
import { MAX_COMPARE_CARDS } from "@/modules/catalog/comparison";
import { getCompareOptions, resolveComparisonCards } from "@/modules/catalog/comparison-server";
import { resolveProgramPlans } from "@/modules/catalog/program-details";

export const metadata: Metadata = { title: "Compare crypto cards", description: "Compare crypto-card fees, rewards, plans, and benefits side by side." };

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ cards?: string | string[]; plans?: string | string[] }> }) {
  const query = await searchParams;
  const [cards, compareOptions] = await Promise.all([
    resolveComparisonCards(query.cards),
    getCompareOptions(),
  ]);
  const selectedSlugs = cards.map((card) => card.slug);
  const plans = resolveProgramPlans(cards, query.plans);
  return (
    <div className="shell page-stack compare-page">
      <header className="editorial-header"><div><p className="kicker">Card comparison</p><h1>Compare cards side by side.</h1></div><p>Choose up to four cards. For cards with multiple plans, pick the plan directly in the table.</p></header>
      {cards.length >= 2 ? <>
        <div className="compare-selection-bar">
          <p><strong>{cards.length} selected</strong><span>Up to four on desktop and three when starting on mobile.</span></p>
          {cards.length < MAX_COMPARE_CARDS ? <ComparePicker cards={compareOptions} initialSelected={selectedSlugs} initialPlans={plans} buttonLabel="Add or change cards" /> : <span className="compare-limit">Four-card limit reached</span>}
        </div>
        <ComparisonTable cards={cards} key={JSON.stringify(plans)} plans={plans} />
      </> : <section className="compare-empty" aria-labelledby="compare-empty-title">
        <p className="kicker">Start a comparison</p>
        <h2 id="compare-empty-title">Select at least two cards.</h2>
        <p>Choose the cards you want to compare.</p>
        <ComparePicker cards={compareOptions} initialSelected={selectedSlugs} initialPlans={plans} buttonLabel={cards.length === 1 ? "Add another card" : "Choose cards"} buttonClassName="button primary" />
      </section>}
    </div>
  );
}
