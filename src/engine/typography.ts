import { fluidClamp } from './clamp'
import type { FluidConfig, TypographyConfig } from '../types'

export interface TypeStepOutput {
  key: string
  value: string // clamp(...) or rem
  minRem: number
  maxRem: number
}

/**
 * Fluid type scale. Each step's size = base * ratio^step. The small-viewport
 * size uses a gentler ratio so mobile type doesn't blow out; clamp() fluidly
 * interpolates between the two across the viewport window.
 */
export function generateTypeScale(
  typo: TypographyConfig,
  fluid: FluidConfig,
): TypeStepOutput[] {
  const base = typo.baseSizePx
  return typo.steps.map((s) => {
    const maxRem = (base * typo.scaleRatio ** s.step) / base
    const minRem =
      s.step === 0
        ? maxRem
        : (base * typo.minScaleRatio ** s.step) / base
    const value = fluidClamp({
      minRem,
      maxRem,
      minViewportPx: fluid.minViewportPx,
      maxViewportPx: fluid.maxViewportPx,
      baseSizePx: base,
    })
    return { key: s.key, value, minRem, maxRem }
  })
}
