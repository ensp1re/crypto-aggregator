"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Columns3, Search, X } from "lucide-react";
import { comparisonHref, type CompareOption } from "@/modules/catalog/comparison";

type ComparePickerProps = {
  cards: CompareOption[];
  initialSelected?: string[];
  initialPlans?: Record<string, string>;
  anchorSlug?: string;
  buttonLabel?: string;
  buttonClassName?: string;
  disabled?: boolean;
};

export function ComparePicker({
  cards,
  initialSelected = [],
  initialPlans = {},
  anchorSlug,
  buttonLabel = "Add card",
  buttonClassName = "button secondary",
  disabled = false,
}: ComparePickerProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(4);
  const [selected, setSelected] = useState<string[]>(() => initialSelection(initialSelected, anchorSlug));

  const filteredCards = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = normalized ? cards.filter((card) => [card.name, card.issuer, card.regions, card.custody, card.network]
      .some((value) => value.toLowerCase().includes(normalized))) : cards;
    return [...matches].sort((left, right) => selectionRank(left.slug, selected) - selectionRank(right.slug, selected));
  }, [cards, query, selected]);

  const openPicker = () => {
    const nextSelected = initialSelection(initialSelected, anchorSlug);
    const responsiveLimit = window.matchMedia("(max-width: 760px)").matches ? 3 : 4;
    setSelected(nextSelected);
    setLimit(Math.max(responsiveLimit, nextSelected.length));
    setQuery("");
    dialogRef.current?.showModal();
    window.requestAnimationFrame(() => searchRef.current?.focus());
  };

  const closePicker = () => dialogRef.current?.close();

  const toggleCard = (slug: string, checked: boolean) => {
    if (slug === anchorSlug) return;
    setSelected((current) => {
      if (!checked) return current.filter((item) => item !== slug);
      if (current.includes(slug) || current.length >= limit) return current;
      return [...current, slug];
    });
  };

  const submitComparison = () => {
    if (selected.length < 2) return;
    closePicker();
    router.push(comparisonHref(selected, initialPlans));
  };

  const atLimit = selected.length >= limit;
  const anchor = anchorSlug ? cards.find((card) => card.slug === anchorSlug) : undefined;

  return (
    <>
      <button ref={triggerRef} className={buttonClassName} type="button" onClick={openPicker} disabled={disabled}>
        <Columns3 aria-hidden="true" size={17} /> {buttonLabel}
      </button>
      <dialog
        ref={dialogRef}
        className="compare-picker-dialog"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClose={() => triggerRef.current?.focus()}
      >
        <form className="compare-picker" onSubmit={(event) => { event.preventDefault(); submitComparison(); }}>
          <header className="compare-picker-header">
            <div>
              <p className="kicker">Build comparison</p>
              <h2 id={titleId}>{anchor ? `Compare ${anchor.name}` : "Choose cards to compare"}</h2>
              <p id={descriptionId}>Select at least two cards. Plans, memberships, and reward tiers can be changed in the comparison.</p>
            </div>
            <button className="icon-button" type="button" onClick={closePicker} aria-label="Close card picker">
              <X aria-hidden="true" size={20} />
            </button>
          </header>

          <div className="compare-picker-search">
            <label htmlFor={searchId}>Search available cards</label>
            <div className="picker-search-field">
              <Search aria-hidden="true" size={17} />
              <input
                ref={searchRef}
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Card, issuer, region, or funding model"
                autoComplete="off"
              />
            </div>
            <p className="picker-count" aria-live="polite">{selected.length} of {limit} selected</p>
          </div>

          <fieldset className="compare-picker-list">
            <legend className="sr-only">Available cards</legend>
            {filteredCards.length > 0 ? filteredCards.map((card) => {
              const inputId = `${searchId}-${card.slug}`;
              const isSelected = selected.includes(card.slug);
              const isPinned = card.slug === anchorSlug;
              const selectionDisabled = isPinned || (!isSelected && atLimit);
              return (
                <label className={`compare-picker-row${isSelected ? " selected" : ""}${isPinned ? " pinned" : ""}`} key={card.slug} htmlFor={inputId}>
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={isSelected}
                    disabled={selectionDisabled}
                    onChange={(event) => toggleCard(card.slug, event.target.checked)}
                  />
                  <span className="picker-card-copy">
                    <strong>{card.name}</strong>
                    <small>{card.issuer} / {card.custody} / {card.network}</small>
                    <small>Regions: {card.regions}</small>
                  </span>
                  {isPinned ? <span className="picker-included">Included</span> : null}
                </label>
              );
            }) : <p className="picker-no-results">No cards match this search. Try an issuer, network, or region.</p>}
          </fieldset>

          <footer className="compare-picker-footer">
            <p>{atLimit ? `${limit}-card limit reached. Remove a selection to choose another.` : "You can change the selection again on the comparison page."}</p>
            <div>
              <button className="button secondary" type="button" onClick={closePicker}>Cancel</button>
              <button className="button primary" type="submit" disabled={selected.length < 2}>
                Compare {selected.length} {selected.length === 1 ? "card" : "cards"}
              </button>
            </div>
          </footer>
        </form>
      </dialog>
    </>
  );
}

function initialSelection(initialSelected: string[], anchorSlug?: string) {
  return [...new Set(anchorSlug ? [anchorSlug, ...initialSelected] : initialSelected)];
}

function selectionRank(slug: string, selected: string[]) {
  const index = selected.indexOf(slug);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}
