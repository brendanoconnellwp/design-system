import type { DesignSystem } from '../types'

const RATIOS: [string, string][] = [
  ['1-2', 'minmax(0, 1fr) minmax(0, 2fr)'],
  ['1-3', 'minmax(0, 1fr) minmax(0, 3fr)'],
  ['2-1', 'minmax(0, 2fr) minmax(0, 1fr)'],
  ['2-3', 'minmax(0, 2fr) minmax(0, 3fr)'],
  ['3-1', 'minmax(0, 3fr) minmax(0, 1fr)'],
  ['3-2', 'minmax(0, 3fr) minmax(0, 2fr)'],
]

/** Layout custom properties: gaps, content width, and grid templates. */
export function generateLayoutVars(ds: DesignSystem): Record<string, string> {
  const p = ds.export.prefix
  const v: Record<string, string> = {}
  const max = Math.min(Math.max(ds.layout.maxColumns, 2), 16)

  v[`--${p}content-width`] = ds.layout.contentWidth
  v[`--${p}grid-gap`] = ds.layout.gaps.gridGap
  v[`--${p}content-gap`] = ds.layout.gaps.contentGap
  v[`--${p}container-gap`] = ds.layout.gaps.containerGap

  for (let n = 1; n <= max; n++) {
    v[`--${p}grid-${n}`] = `repeat(${n}, minmax(0, 1fr))`
  }
  for (const [key, val] of RATIOS) v[`--${p}grid-${key}`] = val
  return v
}

/**
 * Responsive auto-grid column template. N columns on wide screens;
 * auto-fit collapses them on smaller viewports without media queries.
 */
function autoGridTemplate(p: string, n: number, agg: number): string {
  const cw = `var(--${p}content-width)`
  const gap = `var(--${p}grid-gap)`
  const ideal = `calc((${cw} - ((${n} - 1) * ${gap})) / ${n} * ${agg})`
  const fluid = `(100% - (${n} - 1) * ${gap}) / ${n}`
  const min = `min(100%, max(${ideal}, ${fluid}))`
  return `repeat(auto-fit, minmax(${min}, 1fr))`
}

/** Grid + gap utility classes (double-dash modifier naming). */
export function generateLayoutUtilities(ds: DesignSystem): string {
  const p = ds.export.prefix
  const cls = (n: string) => `.${p}${n}`
  const max = Math.min(Math.max(ds.layout.maxColumns, 2), 16)
  const out: string[] = []

  // Fixed column grids
  for (let n = 1; n <= max; n++) {
    out.push(
      `${cls(`grid--${n}`)} { display: grid; grid-template-columns: var(--${p}grid-${n}); gap: var(--${p}grid-gap); width: 100%; }`,
    )
  }
  // Ratio grids
  for (const [key] of RATIOS) {
    out.push(
      `${cls(`grid--${key}`)} { display: grid; grid-template-columns: var(--${p}grid-${key}); gap: var(--${p}grid-gap); width: 100%; }`,
    )
  }
  // Responsive auto grids
  for (let n = 2; n <= max; n++) {
    out.push(
      `${cls(`grid--auto-${n}`)} { display: grid; grid-template-columns: ${autoGridTemplate(p, n, ds.layout.autoGridAggressiveness)}; gap: var(--${p}grid-gap); width: 100%; }`,
    )
  }

  // Gap utilities driven by the spacing scale
  for (const s of ds.spacing.steps) {
    out.push(`${cls(`gap--${s.key}`)} { gap: var(--${p}space-${s.key}); --${p}grid-gap: var(--${p}space-${s.key}); }`)
    out.push(`${cls(`col-gap--${s.key}`)} { column-gap: var(--${p}space-${s.key}); }`)
    out.push(`${cls(`row-gap--${s.key}`)} { row-gap: var(--${p}space-${s.key}); }`)
  }
  out.push(`${cls('gap--none')} { gap: 0; }`)

  // Contextual gap helpers
  out.push(`${cls('content-gap')} { gap: var(--${p}content-gap); }`)
  out.push(`${cls('container-gap')} { gap: var(--${p}container-gap); }`)
  out.push(`${cls('grid-gap')} { gap: var(--${p}grid-gap); }`)

  return out.join('\n')
}
