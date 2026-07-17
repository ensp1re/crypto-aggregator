# CardStats design system

**Updated:** 17 July 2026

**Direction:** Editorial fintech research ledger

**Design dials:** variance 6/10, motion 3/10, density 8/10

## Product posture

CardStats is a consumer research product with professional analytics depth. It should feel like an
independent financial publication joined to a precise data instrument, not a crypto exchange, generic
SaaS dashboard, affiliate directory, or collection of plastic-card mockups.

The public experience uses one system across discovery, detail, comparison, and analytics. Discovery
can be broad, but verification status, denominator, method, scope, and observation time always travel
with the data. Never imply that a competitor observation is issuer-verified.

## Visual language

| Role | Token | Value |
|---|---|---|
| Canvas | `--paper` | `#F3F0E8` |
| Secondary canvas | `--paper-deep` | `#E9E4D8` |
| Raised surface | `--surface` | `#FBFAF6` |
| Primary text | `--ink` | `#151515` |
| Secondary text | `--ink-soft` | `#55534E` |
| Rule | `--rule` | `#C8C2B5` |
| Action | `--blue` | `#2355E8` |
| Action hover | `--blue-dark` | `#173BAA` |
| Brand signal | `--acid` | `#D7FF43` |
| Caveat surface | `--warning-bg` | `#FFF1CE` |

- Warm paper and ink do most of the work. Cobalt is the only action accent.
- Acid is reserved for the small brand mark and one ledger offset, never large backgrounds.
- Use one-pixel rules and square geometry. Avoid rounded card grids, glass, gradients, glow, and
  decorative shadows.
- The only deliberate display-font contrast is restrained Georgia italic in the home headline.
  Data and body copy use the system sans stack; metadata uses the system monospace stack.
- Use tabular figures for metrics. Body text stays 16px minimum and long copy stays under 75 characters.

## Layout

- Maximum shell: 82rem with 20px mobile and 20px to 40px desktop gutters.
- Mobile-first breakpoints: 420px, 760px, and 1000px; verify at 375px, 768px, 1024px, and 1440px.
- Use 4px and 8px spacing increments. Dense information is separated by alignment and rules, not tiny
  type.
- Home can be asymmetric. Catalog and analytics use compact aligned ledgers.
- Never use generic three-card feature grids or a wall of KPI cards. Analytics starts with one question,
  answer, denominator, controls, chart, data table, and interpretation.

## Components

- **Buttons:** square, 44px minimum, cobalt primary and ink-outline secondary. No gradient or scale hover.
- **Issuer mark:** fixed square with declared dimensions. Current competitor-sourced avatars are visibly
  discovery-only and must be replaced by official issuer assets with provenance.
- **Catalog row:** identity, four decision facts, and profile action. Do not repeat status labels on every
  row; source context belongs in the surrounding page and evidence surfaces.
- **Profile fact sheet:** pair each label with its observed value. Reserve row-level evidence links for
  official-source observations that a reader can inspect.
- **Selector:** use the square custom listbox with a persistent label, current value, checkmark, and cobalt
  active rule. It must preserve form submission and support arrows, Home, End, Enter, Space, Escape, Tab,
  type-ahead, outside click, visible focus, and 44px touch targets.
- **Comparison:** one shared context, no winner before eligibility and economics verification; stack each
  card value under the factor on mobile.
- **Charts:** horizontal bars for categorical counts, exact direct labels, denominator and method above,
  accessible table below. Do not use pie charts for the custody taxonomy.
- **Caveats:** amber surface with icon plus text. Color never carries meaning alone.

## Motion and interaction

- Use 180ms color, border, or opacity transitions. No entrance animation, parallax, floating elements, or
  looping decoration.
- Pressed states may change opacity but never layout bounds.
- All interactive elements are keyboard reachable, visibly focused, and at least 44 by 44px on touch.
- Respect `prefers-reduced-motion`; no content is hidden pending JavaScript or animation.

## Content rules

- Use “reported” and “observed” for discovery data without repeating warning labels on each component.
- Reserve “verified” for independent official evidence that passed publication review.
- Never turn unknown into zero or rank on mismatched regional offerings.
- Use “address” rather than “user” for onchain address counts.
- Do not use em or en dashes in visible product copy.
- Keep promotional language and categorical user personas out of the interface.

## Pre-delivery gate

- No emoji controls, faux card art, generic bento sections, glass, neon, or purple gradients.
- One Lucide outline-icon family; meaningful issuer images have dimensions and text alternatives.
- Axe has no violations on home, catalog, detail, comparison, and analytics.
- No horizontal overflow at 375px, 200% text, or 812 by 375 landscape.
- Every mobile interactive target is at least 44px; visible focus and reduced motion pass.
- Charts have exact labels, text insight, denominator, method, and an accessible table.
- Desktop at 1440px and mobile at 375px have been visually inspected.
