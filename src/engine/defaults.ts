import type { DesignSystem } from '../types'

export const defaultSystem: DesignSystem = {
  meta: { name: 'My Design System', version: '1.0.0' },
  fluid: { minViewportPx: 375, maxViewportPx: 1440 },
  color: {
    brand: [
      { key: 'primary', label: 'Primary', hex: '#4f46e5' },
      { key: 'secondary', label: 'Secondary', hex: '#0ea5e9' },
      { key: 'accent', label: 'Accent', hex: '#f59e0b' },
      { key: 'base', label: 'Base', hex: '#334155' },
      { key: 'neutral', label: 'Neutral', hex: '#000000' },
      { key: 'success', label: 'Success', hex: '#16a34a' },
      { key: 'warning', label: 'Warning', hex: '#d97706' },
      { key: 'danger', label: 'Danger', hex: '#dc2626' },
    ],
    // fixed lightness targets per rung (hue + saturation preserved)
    lightness: { ultraLight: 95, light: 85, semiLight: 65, semiDark: 35, dark: 25, ultraDark: 10 },
    hoverDelta: 5,
    transparencySteps: [10, 20, 30, 40, 50, 60, 70, 80, 90],
    numericScale: false,
  },
  typography: {
    baseSizePx: 16,
    scaleRatio: 1.25,
    minScaleRatio: 1.2,
    steps: [
      { key: 'xs', step: -2 },
      { key: 's', step: -1 },
      { key: 'm', step: 0 },
      { key: 'l', step: 1 },
      { key: 'xl', step: 2 },
      { key: '2xl', step: 3 },
      { key: '3xl', step: 4 },
      { key: '4xl', step: 5 },
    ],
    fonts: {
      heading: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      body: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      mono: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
    },
    weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
    lineHeight: { tight: 1.15, normal: 1.5, loose: 1.75 },
  },
  spacing: {
    baseRem: 1,
    ratio: 1.5,
    steps: [
      { key: 'xs', factor: 0.25 },
      { key: 's', factor: 0.5 },
      { key: 'm', factor: 1 },
      { key: 'l', factor: 1.5 },
      { key: 'xl', factor: 2.5 },
      { key: '2xl', factor: 4 },
      { key: '3xl', factor: 6 },
    ],
  },
  radius: {
    // ratio-1.5 radius ladder
    steps: [
      { key: 'xs', px: 3.56 },
      { key: 's', px: 5.33 },
      { key: 'm', px: 8 },
      { key: 'l', px: 12 },
      { key: 'xl', px: 18 },
      { key: 'xxl', px: 27 },
      { key: 'full', px: 9999 },
    ],
  },
  shadow: {
    steps: [
      { key: 's', value: '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.10)' },
      { key: 'm', value: '0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.10)' },
      { key: 'l', value: '0 8px 16px rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.12)' },
      { key: 'xl', value: '0 16px 32px rgba(0,0,0,0.10), 0 24px 48px rgba(0,0,0,0.16)' },
    ],
  },
  motion: {
    durations: [
      { key: 'fast', ms: 150 },
      { key: 'base', ms: 250 },
      { key: 'slow', ms: 400 },
    ],
    easings: [
      { key: 'standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      { key: 'in', value: 'cubic-bezier(0.4, 0, 1, 1)' },
      { key: 'out', value: 'cubic-bezier(0, 0, 0.2, 1)' },
    ],
  },
  layout: {
    contentWidth: '80rem',
    autoGridAggressiveness: 0.7,
    maxColumns: 12,
    gaps: {
      gridGap: 'var(--space-m)',
      contentGap: 'var(--space-s)',
      containerGap: 'var(--space-l)',
    },
  },
  export: {
    unit: 'rem',
    colorFormat: 'hsl',
    includeComments: true,
    includeReset: false,
    includeUtilities: true,
    includeComponents: true,
    prefix: '',
    selector: ':root',
  },
}
