import { fluidClamp } from './clamp'
import type { FluidConfig, SpacingConfig, TypographyConfig } from '../types'

export interface SpaceStepOutput {
  key: string
  value: string
}

/**
 * Fluid spacing scale. Each step = base * factor, with the small-viewport
 * value scaled down so spacing tightens on mobile. Uses the same clamp window
 * as typography for a coherent rhythm.
 */
export function generateSpacingScale(
  spacing: SpacingConfig,
  fluid: FluidConfig,
  typo: TypographyConfig,
): SpaceStepOutput[] {
  const base = typo.baseSizePx
  // gentle mobile reduction: smaller steps shrink less, larger steps shrink more
  return spacing.steps.map((s) => {
    const maxRem = spacing.baseRem * s.factor
    const minRem = maxRem * (s.factor >= 1 ? 0.72 : 0.85)
    const value = fluidClamp({
      minRem,
      maxRem,
      minViewportPx: fluid.minViewportPx,
      maxViewportPx: fluid.maxViewportPx,
      baseSizePx: base,
    })
    return { key: s.key, value }
  })
}
