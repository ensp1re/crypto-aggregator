"use client";

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { IssuerMark } from "./issuer-mark";
import { comparisonHref } from "@/modules/catalog/comparison";
import type { DiscoveryCard } from "@/modules/catalog/discovery";

const groups = [
  { label: "Access", rows: [["Reported regions", "regions"], ["KYC", "kyc"]] },
  { label: "Funding and card model", rows: [["Funding control", "custody"], ["Card model", "type"], ["Network", "network"], ["Supported assets", "supportedAssets"]] },
  { label: "Cost and access limits", rows: [["Annual fee", "annualFee"], ["FX fee", "fxFee"], ["ATM limit", "atmLimit"]] },
  { label: "Rewards and qualification", rows: [["Maximum reported reward", "cashbackMax"], ["Qualification", "stakingRequired"]] },
] as const;

export function ComparisonTable({ cards }: { cards: DiscoveryCard[] }) {
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollId = useId();
  const visibleGroups = useMemo(() => groups.map((group) => ({
    ...group,
    rows: group.rows.filter(([, key]) => !differencesOnly || new Set(cards.map((card) => displayValue(card, key))).size > 1),
  })).filter((group) => group.rows.length > 0), [cards, differencesOnly]);

  const scrollTable = (direction: -1 | 1) => {
    const container = scrollRef.current;
    if (!container) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollBy({ left: direction * Math.max(240, container.clientWidth * 0.7), behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section className="comparison-surface" aria-labelledby="comparison-table-title">
      <div className="comparison-toolbar">
        <div><p className="kicker">Selected observations</p><h2 id="comparison-table-title">Compare each reported factor</h2></div>
        <label className="difference-toggle"><input type="checkbox" checked={differencesOnly} onChange={(event) => setDifferencesOnly(event.target.checked)} /> <span>Differences only</span></label>
      </div>
      <div className="mobile-table-guide">
        <p>Scroll the table horizontally to inspect every selected card.</p>
        <div>
          <button type="button" aria-label="Scroll comparison left" aria-controls={scrollId} onClick={() => scrollTable(-1)}><ChevronLeft aria-hidden="true" size={19} /></button>
          <button type="button" aria-label="Scroll comparison right" aria-controls={scrollId} onClick={() => scrollTable(1)}><ChevronRight aria-hidden="true" size={19} /></button>
        </div>
      </div>
      <div ref={scrollRef} id={scrollId} className="compare-table-scroll" tabIndex={0} aria-label="Scrollable card comparison">
        <table className="compare-table" style={{ minWidth: `${11 + cards.length * 13}rem` }}>
          <caption>Crypto card comparison</caption>
          <thead>
            <tr>
              <th className="factor-column" scope="col">Decision factor</th>
              {cards.map((card) => <th id={`card-${card.slug}`} scope="col" key={card.id}>
                <div className="compare-card-heading">
                  <IssuerMark issuer={card.issuer} src={card.logo} alt={card.media?.alt} size={42} />
                  <span><strong><Link href={`/cards/${card.slug}`}>{card.name}</Link></strong><small>{card.issuer}</small></span>
                  <span className="compare-card-actions">
                    <Link href={comparisonHref(cards.filter((item) => item.slug !== card.slug).map((item) => item.slug))} aria-label={`Remove ${card.name} from comparison`}><X aria-hidden="true" size={16} /></Link>
                  </span>
                </div>
              </th>)}
            </tr>
          </thead>
          {visibleGroups.map((group) => <tbody key={group.label}>
            <tr className="compare-group"><th colSpan={cards.length + 1}>{group.label}</th></tr>
            {group.rows.map(([label, key]) => {
              const rowId = `factor-${key}`;
              return <tr key={key}>
                <th id={rowId} className="factor-column" scope="row">{label}</th>
                {cards.map((card) => <td headers={`${rowId} card-${card.slug}`} key={card.id}>{displayValue(card, key)}</td>)}
              </tr>;
            })}
          </tbody>)}
        </table>
      </div>
    </section>
  );
}

function displayValue(card: DiscoveryCard, key: (typeof groups)[number]["rows"][number][1]) {
  if (key === "cashbackMax") {
    if (typeof card.cashbackMax === "number") return `${card.cashbackMax}%`;
    return card.cashbackMax ?? "Undisclosed";
  }
  return String(card[key]);
}
