"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CustomSelect } from "./custom-select";

type ProfileDimension = {
  id: string;
  label: string;
  options: Array<{ id: string; name: string; summary: string }>;
};

export function ProfilePlanSelector({ cardName, cardSlug, dimensions, selected }: { cardName: string; cardSlug: string; dimensions: ProfileDimension[]; selected: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState(selected);
  const [pending, startTransition] = useTransition();

  const change = (dimensionId: string, optionId: string) => {
    const next = { ...values, [dimensionId]: optionId };
    setValues(next);
    const params = new URLSearchParams();
    for (const dimension of dimensions) {
      const value = next[dimension.id] ?? dimension.options[0]?.id;
      if (value) params.append("plans", `${dimension.id}:${value}`);
    }
    startTransition(() => router.replace(`/cards/${cardSlug}?${params.toString()}`, { scroll: false }));
  };

  return <section className="plan-selector" aria-labelledby="plan-selector-title" aria-busy={pending}>
    <div className="plan-selector-heading"><p className="kicker">Card options</p><h2 id="plan-selector-title">Choose your card setup</h2></div>
    <div className="plan-dimensions">
      {dimensions.map((dimension) => {
        const selectedId = values[dimension.id] ?? dimension.options[0]?.id;
        const option = dimension.options.find(({ id }) => id === selectedId) ?? dimension.options[0];
        return <div className="plan-dimension" key={dimension.id}>
          <CustomSelect label={dimension.label} options={dimension.options.map(({ id, name }) => ({ value: id, label: name }))} value={selectedId} onValueChange={(optionId) => change(dimension.id, optionId)} />
          {option ? <p><strong>{option.name}</strong><span>{option.summary}</span></p> : null}
        </div>;
      })}
    </div>
    <span className="sr-only" aria-live="polite">{pending ? `Updating ${cardName} details` : `${cardName} details updated`}</span>
  </section>;
}
