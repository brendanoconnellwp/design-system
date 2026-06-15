import type { DesignSystem } from '../types'

/**
 * Component styles built entirely from the generated tokens, so the live
 * preview is the exact CSS users export. Class names share the export prefix.
 */
export function componentCss(ds: DesignSystem): string {
  const p = ds.export.prefix
  const c = (n: string) => `.${p}${n}`
  return `
${c('btn')} {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--${p}space-xs);
  padding: var(--${p}space-s) var(--${p}space-m);
  font-family: var(--${p}font-body); font-size: var(--${p}text-m); font-weight: var(--${p}fw-semibold);
  line-height: 1; border: 1px solid transparent; border-radius: var(--${p}radius-m);
  background: var(--${p}primary); color: var(--${p}primary-contrast); cursor: pointer;
  transition: background var(--${p}duration-fast) var(--${p}ease-standard), transform var(--${p}duration-fast) var(--${p}ease-standard);
}
${c('btn')}:hover { background: var(--${p}primary-hover); }
${c('btn')}:active { transform: translateY(1px); }
${c('btn--secondary')} { background: var(--${p}secondary); color: var(--${p}secondary-contrast); }
${c('btn--secondary')}:hover { background: var(--${p}secondary-hover); }
${c('btn--outline')} { background: transparent; color: var(--${p}primary); border-color: var(--${p}primary); }
${c('btn--outline')}:hover { background: var(--${p}primary-trans-10); }
${c('btn--ghost')} { background: transparent; color: var(--${p}primary); }
${c('btn--ghost')}:hover { background: var(--${p}primary-trans-10); }
${c('btn--danger')} { background: var(--${p}danger); color: var(--${p}danger-contrast); }
${c('btn--sm')} { padding: var(--${p}space-xs) var(--${p}space-s); font-size: var(--${p}text-s); }
${c('btn--lg')} { padding: var(--${p}space-m) var(--${p}space-l); font-size: var(--${p}text-l); }

${c('input')}, ${c('textarea')}, ${c('select')} {
  width: 100%; padding: var(--${p}space-s) var(--${p}space-m);
  font-family: var(--${p}font-body); font-size: var(--${p}text-m); color: var(--${p}base-ultra-dark);
  background: #fff; border: 1px solid var(--${p}base-light); border-radius: var(--${p}radius-m);
  transition: border-color var(--${p}duration-fast) var(--${p}ease-standard), box-shadow var(--${p}duration-fast) var(--${p}ease-standard);
}
${c('input')}:focus, ${c('textarea')}:focus, ${c('select')}:focus {
  outline: none; border-color: var(--${p}primary); box-shadow: 0 0 0 3px var(--${p}primary-trans-20);
}
${c('textarea')} { min-height: 6rem; resize: vertical; }
${c('label')} { display: block; margin-bottom: var(--${p}space-xs); font-size: var(--${p}text-s); font-weight: var(--${p}fw-medium); color: var(--${p}base-dark); }

${c('switch')} { position: relative; display: inline-flex; width: 2.75rem; height: 1.5rem; }
${c('switch')} input { position: absolute; opacity: 0; }
${c('switch')} span { position: absolute; inset: 0; background: var(--${p}base-light); border-radius: var(--${p}radius-full); transition: background var(--${p}duration-base) var(--${p}ease-standard); }
${c('switch')} span::after { content: ''; position: absolute; top: 2px; left: 2px; width: 1.25rem; height: 1.25rem; background: #fff; border-radius: 50%; transition: transform var(--${p}duration-base) var(--${p}ease-standard); }
${c('switch')} input:checked + span { background: var(--${p}primary); }
${c('switch')} input:checked + span::after { transform: translateX(1.25rem); }

${c('badge')} {
  display: inline-flex; align-items: center; padding: 0.15em var(--${p}space-s);
  font-size: var(--${p}text-xs); font-weight: var(--${p}fw-semibold); border-radius: var(--${p}radius-full);
  background: var(--${p}primary-trans-10); color: var(--${p}primary-dark);
}
${c('badge--success')} { background: var(--${p}success-trans-10); color: var(--${p}success-dark); }
${c('badge--warning')} { background: var(--${p}warning-trans-10); color: var(--${p}warning-dark); }
${c('badge--danger')} { background: var(--${p}danger-trans-10); color: var(--${p}danger-dark); }

${c('alert')} {
  display: flex; gap: var(--${p}space-s); padding: var(--${p}space-m);
  border-radius: var(--${p}radius-m); border-left: 3px solid var(--${p}secondary);
  background: var(--${p}secondary-trans-10); color: var(--${p}secondary-ultra-dark); font-size: var(--${p}text-s);
}
${c('alert--success')} { border-color: var(--${p}success); background: var(--${p}success-trans-10); color: var(--${p}success-ultra-dark); }
${c('alert--warning')} { border-color: var(--${p}warning); background: var(--${p}warning-trans-10); color: var(--${p}warning-ultra-dark); }
${c('alert--danger')} { border-color: var(--${p}danger); background: var(--${p}danger-trans-10); color: var(--${p}danger-ultra-dark); }

${c('card')} {
  padding: var(--${p}space-l); background: #fff; border: 1px solid var(--${p}base-ultra-light);
  border-radius: var(--${p}radius-l); box-shadow: var(--${p}shadow-m);
}
${c('card')} h3 { font-family: var(--${p}font-heading); font-size: var(--${p}text-xl); margin-bottom: var(--${p}space-s); }
${c('card')} p { color: var(--${p}base-dark); font-size: var(--${p}text-m); line-height: var(--${p}lh-normal); }

${c('divider')} { height: 1px; background: var(--${p}base-ultra-light); border: 0; margin: var(--${p}space-m) 0; }

${c('table')} { width: 100%; border-collapse: collapse; font-size: var(--${p}text-s); }
${c('table')} th, ${c('table')} td { padding: var(--${p}space-s) var(--${p}space-m); text-align: left; border-bottom: 1px solid var(--${p}base-ultra-light); }
${c('table')} th { font-weight: var(--${p}fw-semibold); color: var(--${p}base-dark); background: var(--${p}base-ultra-light); }

${c('tabs')} { display: flex; gap: var(--${p}space-xs); border-bottom: 1px solid var(--${p}base-ultra-light); }
${c('tab')} { padding: var(--${p}space-s) var(--${p}space-m); font-size: var(--${p}text-s); font-weight: var(--${p}fw-medium); color: var(--${p}base-dark); border-bottom: 2px solid transparent; cursor: pointer; }
${c('tab')}[aria-selected="true"] { color: var(--${p}primary); border-color: var(--${p}primary); }

${c('avatar')} { display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: var(--${p}radius-full); background: var(--${p}primary); color: var(--${p}primary-contrast); font-weight: var(--${p}fw-semibold); }

${c('progress')} { height: 0.5rem; background: var(--${p}base-ultra-light); border-radius: var(--${p}radius-full); overflow: hidden; }
${c('progress')} > span { display: block; height: 100%; background: var(--${p}primary); border-radius: inherit; }
`.trim()
}
