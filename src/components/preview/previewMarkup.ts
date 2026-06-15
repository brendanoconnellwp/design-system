import type { DesignSystem } from '../../types'
import { generateCss } from '../../engine/cssGenerator'

/**
 * Full HTML document for the preview iframe. Always includes the reset and
 * component CSS so the gallery renders, regardless of the user's export
 * toggles — the export panel is what those toggles govern.
 */
export function buildPreviewDoc(ds: DesignSystem): string {
  const previewDs: DesignSystem = {
    ...ds,
    export: { ...ds.export, includeReset: true, includeComponents: true, includeUtilities: true, includeComments: false },
  }
  const css = generateCss(previewDs)
  const p = ds.export.prefix
  const c = (n: string) => `${p}${n}`

  return `<!doctype html><html><head><meta charset="utf-8">
<style>
${css}
body { padding: 32px; background: #f6f7f9; }
.wrap { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 32px; }
.sec { display: flex; flex-direction: column; gap: 14px; }
.sec > h2 { font-size: var(--${c('text-s')}); text-transform: uppercase; letter-spacing: 0.08em; color: var(--${c('base-dark')}); font-family: var(--${c('font-body')}); }
.cluster { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.palette { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.palette > div { height: 44px; border-radius: var(--${c('radius-s')}); display: flex; align-items: flex-end; padding: 3px; font-size: 8px; color: var(--${c('base-trans-50')}); }
.tile { font-size: 11px; color: var(--${c('base-dark')}); font-family: var(--${c('font-body')}); margin-bottom: 4px; }
.radii { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end; }
.radii > div { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 11px; color: var(--${c('base-dark')}); font-family: var(--${c('font-body')}); }
.radii .box { width: 64px; height: 64px; background: var(--${c('primary')}); }
.gridrow { display: grid; gap: var(--${c('grid-gap')}); }
.cell { background: var(--${c('primary-trans-10')}); border: 1px solid var(--${c('primary-trans-30')}); border-radius: var(--${c('radius-s')}); min-height: 52px; display: flex; align-items: center; justify-content: center; font-size: 11px; color: var(--${c('primary-dark')}); font-family: var(--${c('font-body')}); }
</style></head>
<body><div class="wrap">

  <div class="sec">
    <h2>Typography</h2>
    <div style="font-family:var(--${c('font-heading')})">
      <div style="font-size:var(--${c('text-4xl')});font-weight:var(--${c('fw-bold')});line-height:var(--${c('lh-tight')})">Heading One</div>
      <div style="font-size:var(--${c('text-2xl')});font-weight:var(--${c('fw-bold')})">Heading Two</div>
      <div style="font-size:var(--${c('text-xl')});font-weight:var(--${c('fw-semibold')})">Heading Three</div>
    </div>
    <p style="font-family:var(--${c('font-body')});font-size:var(--${c('text-m')});color:var(--${c('base-ultra-dark')});line-height:var(--${c('lh-normal')})">
      Body text scales fluidly with the viewport using <code style="font-family:var(--${c('font-mono')})">clamp()</code>. Resize this preview to watch type and spacing respond.
    </p>
  </div>

  <div class="sec">
    <h2>Colors — full rung ladder</h2>
    ${ds.color.brand
      .map(
        (b) => `<div><div class="tile">${b.label} <code style="font-family:var(--${c('font-mono')})">--${c(b.key)}</code></div><div class="palette">
        <div style="background:var(--${c(b.key)}-ultra-light)">ultra-light</div>
        <div style="background:var(--${c(b.key)}-light)">light</div>
        <div style="background:var(--${c(b.key)}-semi-light)">semi-light</div>
        <div style="background:var(--${c(b.key)});color:var(--${c(b.key)}-contrast)">base</div>
        <div style="background:var(--${c(b.key)}-semi-dark);color:#fff">semi-dark</div>
        <div style="background:var(--${c(b.key)}-dark);color:#fff">dark</div>
        <div style="background:var(--${c(b.key)}-ultra-dark);color:#fff">ultra-dark</div>
      </div></div>`,
      )
      .join('')}
  </div>

  <div class="sec">
    <h2>Border radius</h2>
    <div class="radii">
      ${ds.radius.steps
        .map((r) => `<div><div class="box" style="border-radius:var(--${c(`radius-${r.key}`)})"></div>radius-${r.key}</div>`)
        .join('')}
    </div>
  </div>

  <div class="sec">
    <h2>Grids & gaps</h2>
    <div class="tile"><code style="font-family:var(--${c('font-mono')})">.${c('grid--3')}</code> — fixed 3-column</div>
    <div class="gridrow ${c('grid--3')}"><div class="cell">1</div><div class="cell">2</div><div class="cell">3</div></div>
    <div class="tile" style="margin-top:8px"><code style="font-family:var(--${c('font-mono')})">.${c('grid--auto-4')}</code> — responsive (resize the preview)</div>
    <div class="gridrow ${c('grid--auto-4')}"><div class="cell">1</div><div class="cell">2</div><div class="cell">3</div><div class="cell">4</div><div class="cell">5</div><div class="cell">6</div></div>
    <div class="tile" style="margin-top:8px"><code style="font-family:var(--${c('font-mono')})">.${c('grid--1-2')}</code> — ratio grid</div>
    <div class="gridrow ${c('grid--1-2')}"><div class="cell">1fr</div><div class="cell">2fr</div></div>
  </div>

  <div class="sec">
    <h2>Buttons</h2>
    <div class="cluster">
      <button class="${c('btn')}">Primary</button>
      <button class="${c('btn')} ${c('btn--secondary')}">Secondary</button>
      <button class="${c('btn')} ${c('btn--outline')}">Outline</button>
      <button class="${c('btn')} ${c('btn--ghost')}">Ghost</button>
      <button class="${c('btn')} ${c('btn--danger')}">Danger</button>
    </div>
    <div class="cluster">
      <button class="${c('btn')} ${c('btn--sm')}">Small</button>
      <button class="${c('btn')}">Medium</button>
      <button class="${c('btn')} ${c('btn--lg')}">Large</button>
    </div>
  </div>

  <div class="sec">
    <h2>Form controls</h2>
    <div class="grid2">
      <div><label class="${c('label')}">Email</label><input class="${c('input')}" placeholder="you@example.com"></div>
      <div><label class="${c('label')}">Plan</label><select class="${c('select')}"><option>Starter</option><option>Pro</option></select></div>
    </div>
    <div><label class="${c('label')}">Message</label><textarea class="${c('textarea')}" placeholder="Type here…"></textarea></div>
    <div class="cluster">
      <label class="${c('switch')}"><input type="checkbox" checked><span></span></label>
      <span class="${c('badge')}">New</span>
      <span class="${c('badge')} ${c('badge--success')}">Active</span>
      <span class="${c('badge')} ${c('badge--warning')}">Pending</span>
      <span class="${c('badge')} ${c('badge--danger')}">Failed</span>
    </div>
  </div>

  <div class="sec">
    <h2>Feedback</h2>
    <div class="${c('alert')}">An informational message wired to your secondary color.</div>
    <div class="${c('alert')} ${c('alert--success')}">Saved successfully.</div>
    <div class="${c('alert')} ${c('alert--warning')}">Heads up — check your input.</div>
    <div class="${c('alert')} ${c('alert--danger')}">Something went wrong.</div>
  </div>

  <div class="sec">
    <h2>Cards & data</h2>
    <div class="grid2">
      <div class="${c('card')}">
        <h3>Card title</h3>
        <p>A surface using radius, shadow, and neutral tokens together.</p>
        <div style="margin-top:14px"><button class="${c('btn')} ${c('btn--sm')}">Action</button></div>
      </div>
      <div class="${c('card')}">
        <div class="${c('tabs')}"><div class="${c('tab')}" aria-selected="true">Overview</div><div class="${c('tab')}">Activity</div></div>
        <table class="${c('table')}" style="margin-top:12px"><thead><tr><th>Name</th><th>Status</th></tr></thead>
        <tbody><tr><td>Ada</td><td><span class="${c('badge')} ${c('badge--success')}">Active</span></td></tr>
        <tr><td>Linus</td><td><span class="${c('badge')}">Invited</span></td></tr></tbody></table>
      </div>
    </div>
    <div class="cluster">
      <span class="${c('avatar')}">DS</span>
      <div class="${c('progress')}" style="flex:1"><span style="width:62%"></span></div>
    </div>
  </div>

</div></body></html>`
}
