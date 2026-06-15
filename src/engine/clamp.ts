// Fluid value generator -> CSS clamp().
// Interpolates linearly between a value at minVw and a value at maxVw,
// expressed so it scales with the viewport (vw) but is clamped at both ends.

const round = (n: number, p = 4) => {
  const f = 10 ** p
  return Math.round(n * f) / f
}

export interface ClampInput {
  minRem: number
  maxRem: number
  minViewportPx: number
  maxViewportPx: number
  baseSizePx: number // px-per-rem reference
}

export function fluidClamp({
  minRem,
  maxRem,
  minViewportPx,
  maxViewportPx,
  baseSizePx,
}: ClampInput): string {
  if (round(minRem) === round(maxRem)) return `${round(minRem)}rem`

  const minVwRem = minViewportPx / baseSizePx
  const maxVwRem = maxViewportPx / baseSizePx

  // slope in rem-per-rem-of-viewport
  const slope = (maxRem - minRem) / (maxVwRem - minVwRem)
  const intersect = minRem - slope * minVwRem

  const vw = round(slope * 100) // slope * 100vw, since 1vw = 1% of viewport
  const base = round(intersect)

  const lower = Math.min(minRem, maxRem)
  const upper = Math.max(minRem, maxRem)

  const preferred = base === 0 ? `${vw}vw` : `${base}rem + ${vw}vw`
  return `clamp(${round(lower)}rem, ${preferred}, ${round(upper)}rem)`
}

export const toRem = (px: number, base: number) => round(px / base)
