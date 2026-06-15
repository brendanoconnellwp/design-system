// ── Design System configuration model ────────────────────────────────
// One serializable object describes the entire system. The engine turns
// this into CSS; the UI edits it; import/export round-trips it as JSON.

export type Unit = 'rem' | 'px'

export interface BrandColor {
  /** kebab key used in the variable name, e.g. "primary" -> --primary */
  key: string
  /** human label shown in UI */
  label: string
  /** base hex the rest of the ladder is derived from */
  hex: string
}

export interface ColorConfig {
  /** brand + action colors; each generates a full shade + transparency ladder */
  brand: BrandColor[]
  /** fixed lightness targets (%) per rung; hue + saturation preserved */
  lightness: {
    ultraLight: number
    light: number
    semiLight: number
    semiDark: number
    dark: number
    ultraDark: number
  }
  /** hover = base lightness + this delta (%) */
  hoverDelta: number
  /** transparency steps (alpha %) generated as --{color}-trans-{step} */
  transparencySteps: number[]
  /** generate a numeric 50..950 scale in addition to named shades */
  numericScale: boolean
}

export interface TypeStep {
  key: string // xs, s, m, l, xl, 2xl ...
  /** scale multiplier exponent relative to base (e.g. -1, 0, 1, 2) */
  step: number
}

export interface TypographyConfig {
  baseSizePx: number // root font-size reference (16)
  scaleRatio: number // 1.2 minor third, 1.25 major third, 1.333 perfect fourth...
  /** ratio used at the small viewport so type scales gently on mobile */
  minScaleRatio: number
  steps: TypeStep[]
  fonts: {
    heading: string
    body: string
    mono: string
  }
  weights: {
    normal: number
    medium: number
    semibold: number
    bold: number
  }
  lineHeight: {
    tight: number
    normal: number
    loose: number
  }
}

export interface FluidScaleStep {
  key: string
  /** multiplier of the base size */
  factor: number
}

export interface SpacingConfig {
  baseRem: number // base spacing unit (1rem)
  ratio: number // multiplicative step between sizes
  steps: FluidScaleStep[]
}

export interface RadiusConfig {
  steps: { key: string; px: number }[]
}

export interface ShadowConfig {
  steps: { key: string; value: string }[]
}

export interface MotionConfig {
  durations: { key: string; ms: number }[]
  easings: { key: string; value: string }[]
}

export interface LayoutConfig {
  /** max content width used by auto-grid min-width math, e.g. "80rem" */
  contentWidth: string
  /** auto-grid "aggressiveness" — how eagerly columns collapse (0.5–0.9) */
  autoGridAggressiveness: number
  /** highest column count to generate for grid--N / grid--auto-N */
  maxColumns: number
  /** contextual gap tokens; values are pixel numbers or var() references */
  gaps: {
    gridGap: string
    contentGap: string
    containerGap: string
  }
}

/** viewport window over which fluid clamp() interpolates */
export interface FluidConfig {
  minViewportPx: number
  maxViewportPx: number
}

export interface ExportOptions {
  unit: Unit
  /**
   * 'hsl' (default) links every shade to per-color --h/--s/--l vars, so the
   * whole ladder recomputes from one base. 'hex' bakes static hex per shade.
   */
  colorFormat: 'hsl' | 'hex'
  includeComments: boolean
  includeReset: boolean
  includeUtilities: boolean
  includeComponents: boolean
  prefix: string // optional namespace e.g. "ds-"
  selector: string // where vars land, default ":root"
}

export interface DesignSystem {
  meta: { name: string; version: string }
  fluid: FluidConfig
  color: ColorConfig
  typography: TypographyConfig
  spacing: SpacingConfig
  radius: RadiusConfig
  shadow: ShadowConfig
  motion: MotionConfig
  layout: LayoutConfig
  export: ExportOptions
}
