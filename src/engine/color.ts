import { converter, formatHex, type Hsl } from 'culori'
import type { BrandColor, ColorConfig } from '../types'

const toHsl = converter('hsl')
const toRgb = converter('rgb')

const clampL = (n: number) => Math.max(0, Math.min(100, n))

/** Shade rung names, ordered light → dark. */
export const SHADE_RUNGS = [
  'ultra-light',
  'light',
  'semi-light',
  'semi-dark',
  'dark',
  'ultra-dark',
] as const
export type ShadeRung = (typeof SHADE_RUNGS)[number]

interface HslParts {
  h: number
  s: number // %
  l: number // %
}

function hslOf(hex: string): HslParts {
  const c = toHsl(hex) as Hsl | undefined
  return {
    h: Math.round(c?.h ?? 0),
    s: Math.round((c?.s ?? 0) * 100),
    l: Math.round((c?.l ?? 0) * 100),
  }
}

function hexFromHsl(h: number, s: number, l: number): string {
  return formatHex({ mode: 'hsl', h, s: s / 100, l: l / 100 }) ?? '#000000'
}

/** rgba() at a given alpha %, computed from any hex. */
function withAlpha(hex: string, alphaPct: number): string {
  const c = toRgb(hex)
  if (!c) return hex
  const r = Math.round(c.r * 255)
  const g = Math.round(c.g * 255)
  const b = Math.round(c.b * 255)
  return `rgba(${r}, ${g}, ${b}, ${Math.round((alphaPct / 100) * 100) / 100})`
}

/** Black or white for accessible text on top of the color (luminance split). */
export function contrastColor(hex: string): string {
  const c = toRgb(hex)
  if (!c) return '#ffffff'
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  const lum = 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b)
  return lum > 0.4 ? '#000000' : '#ffffff'
}

export interface ColorOutput {
  key: string
  base: string
  hsl: HslParts
  shades: Record<ShadeRung, string>
  shadeHsl: Record<ShadeRung, HslParts>
  numeric: Record<string, string>
  numericHsl: Record<string, number> // lightness target per stop
  transparency: Record<string, string>
  hover: string
  contrast: string
}

/**
 * Generate the full shade ladder from one base hex: hue + saturation are
 * preserved, lightness is pinned to per-rung targets. hover = base L + delta.
 */
export function generateColor(color: BrandColor, cfg: ColorConfig): ColorOutput {
  const parts = hslOf(color.hex)
  const t = cfg.lightness

  const targets: Record<ShadeRung, number> = {
    'ultra-light': t.ultraLight,
    light: t.light,
    'semi-light': t.semiLight,
    'semi-dark': t.semiDark,
    dark: t.dark,
    'ultra-dark': t.ultraDark,
  }

  const shades = {} as Record<ShadeRung, string>
  const shadeHsl = {} as Record<ShadeRung, HslParts>
  for (const rung of SHADE_RUNGS) {
    const l = clampL(targets[rung])
    shades[rung] = hexFromHsl(parts.h, parts.s, l)
    shadeHsl[rung] = { h: parts.h, s: parts.s, l }
  }

  const numeric: Record<string, string> = {}
  const numericHsl: Record<string, number> = {}
  if (cfg.numericScale) {
    const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    stops.forEach((stop, i) => {
      const l = Math.round(97 - (i / (stops.length - 1)) * (97 - 8))
      numeric[String(stop)] = hexFromHsl(parts.h, parts.s, l)
      numericHsl[String(stop)] = l
    })
  }

  const transparency: Record<string, string> = {}
  for (const step of cfg.transparencySteps) transparency[String(step)] = withAlpha(color.hex, step)

  return {
    key: color.key,
    base: color.hex,
    hsl: parts,
    shades,
    shadeHsl,
    numeric,
    numericHsl,
    transparency,
    hover: hexFromHsl(parts.h, parts.s, clampL(parts.l + cfg.hoverDelta)),
    contrast: contrastColor(color.hex),
  }
}

export function generateAllColors(cfg: ColorConfig): ColorOutput[] {
  return cfg.brand.map((c) => generateColor(c, cfg))
}
