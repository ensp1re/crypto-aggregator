"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export type CustomSelectOption = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  defaultValue?: string;
  compact?: boolean;
  hideLabel?: boolean;
  label: string;
  name?: string;
  onValueChange?: (value: string) => void;
  options: CustomSelectOption[];
  required?: boolean;
  value?: string;
};

export function CustomSelect({ compact = false, defaultValue, hideLabel = false, label, name, onValueChange, options, required = false, value }: CustomSelectProps) {
  const reactId = useId();
  const labelId = `${reactId}-label`;
  const listboxId = `${reactId}-listbox`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const initialIndex = Math.max(0, options.findIndex((option) => option.value === (value ?? defaultValue)));
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(initialIndex);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [open, setOpen] = useState(false);
  const controlledIndex = options.findIndex((option) => option.value === value);
  const selectedIndex = value === undefined ? internalSelectedIndex : Math.max(0, controlledIndex);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    listboxRef.current?.focus();

    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  const showOptions = (direction: 1 | -1 = 1) => {
    if (options.length === 0) return;
    const nextIndex = open
      ? (activeIndex + direction + options.length) % options.length
      : selectedIndex;
    setActiveIndex(nextIndex);
    setOpen(true);
  };

  const choose = (index: number) => {
    if (value === undefined) setInternalSelectedIndex(index);
    setActiveIndex(index);
    setOpen(false);
    if (options[index]) onValueChange?.(options[index].value);
    triggerRef.current?.focus();
  };

  const moveActive = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, options.length - 1));
    setActiveIndex(nextIndex);
    document.getElementById(`${reactId}-option-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
  };

  return (
    <div className={`custom-select${compact ? " compact" : ""}`} ref={rootRef}>
      <span className={hideLabel ? "sr-only" : "custom-select-label"} id={labelId}>
        {label}{required ? <><span aria-hidden="true"> *</span><span className="sr-only"> required</span></> : null}
      </span>
      {name ? <input type="hidden" name={name} value={selected?.value ?? ""} /> : null}
      <button
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={`${labelId} ${reactId}-value`}
        className="custom-select-trigger"
        disabled={options.length === 0}
        onClick={() => {
          setActiveIndex(selectedIndex);
          setOpen((current) => !current);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            showOptions(event.key === "ArrowDown" ? 1 : -1);
          }
        }}
        ref={triggerRef}
        role="combobox"
        type="button"
      >
        <span id={`${reactId}-value`}>{selected?.label ?? "No options available"}</span>
        <ChevronDown aria-hidden="true" size={17} />
      </button>
      {open ? (
        <div
          aria-activedescendant={`${reactId}-option-${activeIndex}`}
          aria-labelledby={labelId}
          className="custom-select-listbox"
          id={listboxId}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              moveActive((activeIndex + 1) % options.length);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              moveActive((activeIndex - 1 + options.length) % options.length);
            } else if (event.key === "Home") {
              event.preventDefault();
              moveActive(0);
            } else if (event.key === "End") {
              event.preventDefault();
              moveActive(options.length - 1);
            } else if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              choose(activeIndex);
            } else if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              triggerRef.current?.focus();
            } else if (event.key === "Tab") {
              setOpen(false);
            } else if (event.key.length === 1) {
              const match = options.findIndex((option) => option.label.toLowerCase().startsWith(event.key.toLowerCase()));
              if (match >= 0) moveActive(match);
            }
          }}
          ref={listboxRef}
          role="listbox"
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <div
              aria-selected={selectedIndex === index}
              className={activeIndex === index ? "custom-select-option active" : "custom-select-option"}
              id={`${reactId}-option-${index}`}
              key={option.value}
              onClick={() => choose(index)}
              onPointerMove={() => setActiveIndex(index)}
              role="option"
            >
              <span>{option.label}</span>
              {selectedIndex === index ? <Check aria-hidden="true" size={16} /> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
