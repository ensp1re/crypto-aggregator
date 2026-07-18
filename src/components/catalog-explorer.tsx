"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { CardRow, type CatalogCardSummary } from "./card-row";
import { CustomSelect } from "./custom-select";

const networkOptions = [
  { value: "all", label: "All networks" },
  { value: "Visa", label: "Visa" },
  { value: "Mastercard", label: "Mastercard" },
  { value: "Visa / Mastercard", label: "Visa / Mastercard" },
];

export function CatalogExplorer({ cards, initialNetwork = "all", initialQuery = "" }: { cards: CatalogCardSummary[]; initialNetwork?: string; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [network, setNetwork] = useState(initialNetwork);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const results = useMemo(() => cards.filter((card) => {
    const matchesQuery = !deferredQuery || card.searchText.includes(deferredQuery);
    const matchesNetwork = network === "all" || networkCategory(card.network) === network;
    return matchesQuery && matchesNetwork;
  }), [cards, deferredQuery, network]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    if (network === "all") url.searchParams.delete("network");
    else url.searchParams.set("network", network);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}`);
  }, [network, query]);

  const clear = () => {
    setQuery("");
    setNetwork("all");
  };

  return <>
    <div className="filter-bar catalog-live-filter" role="search">
      <label className="catalog-search-field" htmlFor="card-search"><span>Search cards</span><span className="search-field-input"><Search aria-hidden="true" size={18} /><input id="card-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Card, issuer, region, or asset" autoComplete="off" />{query ? <button type="button" aria-label="Clear card search" onClick={() => setQuery("")}><X aria-hidden="true" size={16} /></button> : null}</span></label>
      <CustomSelect label="Network" value={network} options={networkOptions} onValueChange={setNetwork} />
    </div>
    <div className="result-line" aria-live="polite"><p><strong>{results.length}</strong> of {cards.length} cards</p><p>Results update as you type.</p></div>
    <section className="catalog-list" id="catalog-results" aria-label="Crypto cards">
      {results.length ? results.map((card) => <CardRow card={card} key={card.id} />) : <div className="empty-state"><h2>No matching card</h2><p>Try another card, issuer, region, asset, or network.</p><button className="button secondary" type="button" onClick={clear}>Clear filters</button></div>}
    </section>
  </>;
}

function networkCategory(value: string) {
  const normalized = value.toLowerCase();
  const visa = normalized.includes("visa");
  const mastercard = normalized.includes("mastercard");
  if (visa && mastercard) return "Visa / Mastercard";
  if (visa) return "Visa";
  if (mastercard) return "Mastercard";
  return "Other network";
}
