import type { DesignSystem } from '../types'

/** A minimal, opinionated reset wired to the system's typography tokens. */
export function resetCss(ds: DesignSystem): string {
  const p = ds.export.prefix
  return `*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html { -webkit-text-size-adjust: 100%; }
body {
  font-family: var(--${p}font-body);
  font-size: var(--${p}text-m);
  line-height: var(--${p}lh-normal);
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4, h5, h6 {
  font-family: var(--${p}font-heading);
  line-height: var(--${p}lh-tight);
  font-weight: var(--${p}fw-bold);
}
h1 { font-size: var(--${p}text-4xl); }
h2 { font-size: var(--${p}text-3xl); }
h3 { font-size: var(--${p}text-2xl); }
h4 { font-size: var(--${p}text-xl); }
h5 { font-size: var(--${p}text-l); }
h6 { font-size: var(--${p}text-m); }
img, picture, svg, video { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
a { color: var(--${p}primary); }`
}
