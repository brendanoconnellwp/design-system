import type { DesignSystem } from '../types'

/**
 * Utility classes mapped to the generated variables. Class names share the
 * export prefix so a namespaced build (e.g. "ds-") stays self-contained.
 */
export function generateUtilities(ds: DesignSystem): string {
  const p = ds.export.prefix
  const cls = (n: string) => `.${p}${n}`
  const out: string[] = []

  // Spacing: padding / margin / gap
  const spaceKeys = ds.spacing.steps.map((s) => s.key)
  for (const k of spaceKeys) {
    out.push(`${cls(`p-${k}`)} { padding: var(--${p}space-${k}); }`)
    out.push(`${cls(`px-${k}`)} { padding-inline: var(--${p}space-${k}); }`)
    out.push(`${cls(`py-${k}`)} { padding-block: var(--${p}space-${k}); }`)
    out.push(`${cls(`m-${k}`)} { margin: var(--${p}space-${k}); }`)
    out.push(`${cls(`mx-${k}`)} { margin-inline: var(--${p}space-${k}); }`)
    out.push(`${cls(`my-${k}`)} { margin-block: var(--${p}space-${k}); }`)
    out.push(`${cls(`gap-${k}`)} { gap: var(--${p}space-${k}); }`)
  }

  // Typography
  for (const t of ds.typography.steps) {
    out.push(`${cls(`text-${t.key}`)} { font-size: var(--${p}text-${t.key}); }`)
  }
  out.push(`${cls('font-heading')} { font-family: var(--${p}font-heading); }`)
  out.push(`${cls('font-body')} { font-family: var(--${p}font-body); }`)
  out.push(`${cls('font-mono')} { font-family: var(--${p}font-mono); }`)

  // Colors: text + background, base shade and named shades
  const shadeNames = ['ultra-light', 'light', 'semi-light', 'semi-dark', 'dark', 'ultra-dark']
  for (const c of ds.color.brand) {
    out.push(`${cls(`color-${c.key}`)} { color: var(--${p}${c.key}); }`)
    out.push(`${cls(`bg-${c.key}`)} { background-color: var(--${p}${c.key}); color: var(--${p}${c.key}-contrast); }`)
    for (const s of shadeNames) {
      out.push(`${cls(`color-${c.key}-${s}`)} { color: var(--${p}${c.key}-${s}); }`)
      out.push(`${cls(`bg-${c.key}-${s}`)} { background-color: var(--${p}${c.key}-${s}); }`)
    }
  }

  // Radius + shadow
  for (const r of ds.radius.steps) out.push(`${cls(`radius-${r.key}`)} { border-radius: var(--${p}radius-${r.key}); }`)
  for (const s of ds.shadow.steps) out.push(`${cls(`shadow-${s.key}`)} { box-shadow: var(--${p}shadow-${s.key}); }`)

  // Flex helpers (grids live in grid.ts)
  out.push(`${cls('flex')} { display: flex; }`)
  out.push(`${cls('flex-col')} { display: flex; flex-direction: column; }`)
  out.push(`${cls('items-center')} { align-items: center; }`)
  out.push(`${cls('justify-between')} { justify-content: space-between; }`)

  return out.join('\n')
}
