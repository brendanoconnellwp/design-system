# Token spec

The conventions the generator follows. Drives the engine so exports stay
consistent across colors, type, spacing, radius, and grids.

## Colors — HSL, fixed-lightness rungs

Each color keeps its input **hue + saturation** and overrides only **lightness**
per rung (percent):

| rung         | L%  |
|--------------|-----|
| ultra-light  | 95  |
| light        | 85  |
| semi-light   | 65  |
| (base)       | input L |
| hover        | base L + delta |
| semi-dark    | 35  |
| dark         | 25  |
| ultra-dark   | 10  |

Output is HSL-linked by default: each color emits `--{c}-h`, `--{c}-s`, `--{c}-l`
and every rung/transparency/hover is `hsl(var(--{c}-h) var(--{c}-s) <L>%)`, so
changing the base recomputes the whole ladder. A static-hex mode is also
available. Transparency: `--{c}-trans-10..90`.

Default colors: **primary, secondary, accent, base, neutral** (+ semantic
success / warning / danger). `contrast` is a resolved black/white per color.

## Typography — fluid clamp

Type steps generated as a `clamp()` scale from a base size + ratio, with a
gentler ratio at the small viewport so headings don't blow out on mobile.

## Spacing — fluid clamp

`--space-*` steps as multiples of a base unit, fluid across a configurable
viewport window.

## Radius — ratio 1.5

`--radius-xs 3.56px`, `--radius-s 5.33px`, `--radius-m 8px`, `--radius-l 12px`,
`--radius-xl 18px`, `--radius-xxl 27px`, plus `--radius-full` (pill/circle).

## Grids & gaps

Contextual gap tokens — `--grid-gap`, `--content-gap`, `--container-gap` — wired
to the spacing scale. Column grids `--grid-1..N`, ratio grids (`--grid-1-2`,
`--grid-2-1`, …), and responsive auto-grids (`.grid--auto-N`) that show N columns
on wide screens and collapse via `auto-fit` without media queries.

## Utility class naming

Double-dash modifier convention: `.bg--primary`, `.text--primary-dark`,
`.padding--m`, `.grid--3`, `.gap--m`, `.radius--m`.
