# Design System Studio

A browser-based, token-driven design-system generator. Define brand colors,
fluid typography and spacing, preview components live, and export production CSS.

## Features

- **Color engine** — enter one brand hex; hue + saturation are kept and lightness
  is pinned per rung (`ultra-light 95% · light 85% · semi-light 65% · semi-dark
  35% · dark 25% · ultra-dark 10%`), plus `hover` (base L + delta) and accessible
  `contrast`. Output is HSL-linked by default so every shade derives from one base
  color via `--c-h/-s/-l` (or switch to static hex). Transparency steps
  (`-trans-10…90`) and an optional numeric `50–950` scale. See
  [`docs/token-spec.md`](docs/token-spec.md).
- **Fluid typography** — base size + scale ratio → `clamp()` type scale.
- **Grids & gaps** — contextual gap tokens (`--grid-gap`, `--content-gap`,
  `--container-gap`) wired to the spacing scale; ready-made column grids
  (`.grid--3`), ratio grids (`.grid--1-2`), and **responsive auto-grids**
  (`.grid--auto-3` → N-up on desktop, auto-collapsing on tablet/mobile).
- **Fluid spacing**, radius, shadow, and motion scales.
- **Live preview** — an isolated iframe renders a full component gallery using
  the *exact* CSS you export.
- **Export options (toggles)** — vars only, or add a reset, utility classes
  (`.p-m`, `.bg-primary`, `grid--3`), and component CSS. Configurable unit
  (rem/px), variable prefix, and selector. Copy or download `.css`, plus
  JSON import/export of the whole config.

## Develop

```bash
npm install          # if devDependencies are skipped, use: npm install --include=dev
npm run dev          # vite dev server
npm run build        # typecheck + production build to dist/
npm run preview      # serve the built dist/
```

> Note: this environment runs with `NODE_ENV=production`, which makes npm skip
> devDependencies. Use `npm install --include=dev` here.

## Architecture

- `src/engine/` — pure, framework-free token logic (the core IP):
  `color.ts`, `typography.ts`, `spacing.ts`, `clamp.ts`, `cssGenerator.ts`,
  `utilities.ts`, `components.ts`, `reset.ts`, `defaults.ts`.
- `src/store/useDesignSystem.ts` — Zustand store + localStorage + import/export.
- `src/components/` — editor panels, preview iframe, code panel.
- `src/types.ts` — the serializable `DesignSystem` config model.

The CSS generator is the single source of truth: the live preview and the
export panel both render from `generateCss(ds)`.

## Deploy (Cloudflare Pages)

```bash
npm run build
npx wrangler pages deploy dist --project-name <name>
```

Then attach the custom subdomain in the Cloudflare Pages dashboard / DNS.
