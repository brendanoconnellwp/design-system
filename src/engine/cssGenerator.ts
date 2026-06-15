import type { DesignSystem } from '../types'
import { generateAllColors } from './color'
import { generateTypeScale } from './typography'
import { generateSpacingScale } from './spacing'
import { generateUtilities } from './utilities'
import { generateLayoutVars, generateLayoutUtilities } from './grid'
import { componentCss } from './components'
import { resetCss } from './reset'

const v = (prefix: string, name: string) => `--${prefix}${name}`

/** Build the full set of CSS custom properties as name/value pairs. */
export function generateVariables(ds: DesignSystem): Record<string, string> {
  const p = ds.export.prefix
  const vars: Record<string, string> = {}

  // ── Colors ──
  const hslMode = ds.export.colorFormat === 'hsl'
  for (const c of generateAllColors(ds.color)) {
    const h = v(p, `${c.key}-h`)
    const s = v(p, `${c.key}-s`)
    const l = v(p, `${c.key}-l`)

    if (hslMode) {
      // Decompose to H/S/L so every shade derives from one base color.
      vars[h] = `${c.hsl.h}`
      vars[s] = `${c.hsl.s}%`
      vars[l] = `${c.hsl.l}%`
      vars[v(p, c.key)] = `hsl(var(${h}) var(${s}) var(${l}))`
      for (const [name, parts] of Object.entries(c.shadeHsl)) {
        vars[v(p, `${c.key}-${name}`)] = `hsl(var(${h}) var(${s}) ${parts.l}%)`
      }
      vars[v(p, `${c.key}-hover`)] = `hsl(var(${h}) var(${s}) calc(var(${l}) + ${ds.color.hoverDelta}%))`
      for (const step of ds.color.transparencySteps) {
        vars[v(p, `${c.key}-trans-${step}`)] = `hsl(var(${h}) var(${s}) var(${l}) / ${step / 100})`
      }
      if (ds.color.numericScale) {
        for (const [stop, ll] of Object.entries(c.numericHsl)) {
          vars[v(p, `${c.key}-${stop}`)] = `hsl(var(${h}) var(${s}) ${ll}%)`
        }
      }
    } else {
      vars[v(p, c.key)] = c.base
      for (const [name, val] of Object.entries(c.shades)) {
        vars[v(p, `${c.key}-${name}`)] = val
      }
      vars[v(p, `${c.key}-hover`)] = c.hover
      for (const [step, val] of Object.entries(c.transparency)) {
        vars[v(p, `${c.key}-trans-${step}`)] = val
      }
      if (ds.color.numericScale) {
        for (const [stop, val] of Object.entries(c.numeric)) {
          vars[v(p, `${c.key}-${stop}`)] = val
        }
      }
    }
    // contrast can't be derived in pure CSS — always a resolved value
    vars[v(p, `${c.key}-contrast`)] = c.contrast
  }

  // ── Typography ──
  vars[v(p, 'font-heading')] = ds.typography.fonts.heading
  vars[v(p, 'font-body')] = ds.typography.fonts.body
  vars[v(p, 'font-mono')] = ds.typography.fonts.mono
  vars[v(p, 'fw-normal')] = String(ds.typography.weights.normal)
  vars[v(p, 'fw-medium')] = String(ds.typography.weights.medium)
  vars[v(p, 'fw-semibold')] = String(ds.typography.weights.semibold)
  vars[v(p, 'fw-bold')] = String(ds.typography.weights.bold)
  vars[v(p, 'lh-tight')] = String(ds.typography.lineHeight.tight)
  vars[v(p, 'lh-normal')] = String(ds.typography.lineHeight.normal)
  vars[v(p, 'lh-loose')] = String(ds.typography.lineHeight.loose)
  for (const t of generateTypeScale(ds.typography, ds.fluid)) {
    vars[v(p, `text-${t.key}`)] = t.value
  }

  // ── Spacing ──
  for (const s of generateSpacingScale(ds.spacing, ds.fluid, ds.typography)) {
    vars[v(p, `space-${s.key}`)] = s.value
  }

  // ── Radius ──
  for (const r of ds.radius.steps) {
    vars[v(p, `radius-${r.key}`)] = r.key === 'full' ? '9999px' : `${r.px}px`
  }

  // ── Shadows ──
  for (const sh of ds.shadow.steps) {
    vars[v(p, `shadow-${sh.key}`)] = sh.value
  }

  // ── Motion ──
  for (const d of ds.motion.durations) vars[v(p, `duration-${d.key}`)] = `${d.ms}ms`
  for (const e of ds.motion.easings) vars[v(p, `ease-${e.key}`)] = e.value

  // ── Layout & Grids ──
  Object.assign(vars, generateLayoutVars(ds))

  return vars
}

function section(title: string, body: string, comment: boolean): string {
  if (!body.trim()) return ''
  const head = comment ? `  /* ── ${title} ── */\n` : ''
  return head + body
}

/** Render the :root variables block, grouped with comments if enabled. */
function renderVariablesBlock(ds: DesignSystem): string {
  const p = ds.export.prefix
  const comment = ds.export.includeComments
  const all = generateVariables(ds)

  const groups: { title: string; test: (k: string) => boolean }[] = [
    { title: 'Colors', test: (k) => isColorVar(k, p, ds) },
    { title: 'Typography', test: (k) => /-(font|fw|lh|text)-/.test(k) || k.startsWith(`--${p}font-`) || k.startsWith(`--${p}fw-`) || k.startsWith(`--${p}lh-`) || k.startsWith(`--${p}text-`) },
    { title: 'Spacing', test: (k) => k.startsWith(`--${p}space-`) },
    { title: 'Radius', test: (k) => k.startsWith(`--${p}radius-`) },
    { title: 'Shadows', test: (k) => k.startsWith(`--${p}shadow-`) },
    { title: 'Motion', test: (k) => k.startsWith(`--${p}duration-`) || k.startsWith(`--${p}ease-`) },
    {
      title: 'Layout & Grids',
      test: (k) =>
        k.startsWith(`--${p}grid`) ||
        k.startsWith(`--${p}content-width`) ||
        k.startsWith(`--${p}content-gap`) ||
        k.startsWith(`--${p}container-gap`),
    },
  ]

  let out = `${ds.export.selector} {\n`
  const used = new Set<string>()
  for (const g of groups) {
    const lines = Object.entries(all)
      .filter(([k]) => !used.has(k) && g.test(k))
      .map(([k, val]) => {
        used.add(k)
        return `  ${k}: ${val};`
      })
    if (lines.length) {
      if (comment) out += `\n  /* ── ${g.title} ── */\n`
      out += lines.join('\n') + '\n'
    }
  }
  out += '}\n'
  return out
}

function isColorVar(k: string, p: string, ds: DesignSystem): boolean {
  return ds.color.brand.some(
    (c) => k === `--${p}${c.key}` || k.startsWith(`--${p}${c.key}-`),
  )
}

/** Assemble the complete production stylesheet from config + export options. */
export function generateCss(ds: DesignSystem): string {
  const { includeComments, includeReset, includeUtilities, includeComponents } = ds.export
  const parts: string[] = []

  if (includeComments) {
    parts.push(
      `/*\n * ${ds.meta.name} — v${ds.meta.version}\n * Generated with Design System Studio\n */\n`,
    )
  }

  parts.push(renderVariablesBlock(ds))

  if (includeReset) parts.push(section('Reset', resetCss(ds), includeComments))
  if (includeUtilities) {
    parts.push(section('Utilities', generateUtilities(ds), includeComments))
    parts.push(section('Grids & gaps', generateLayoutUtilities(ds), includeComments))
  }
  if (includeComponents) parts.push(section('Components', componentCss(ds), includeComments))

  return parts.filter(Boolean).join('\n')
}
