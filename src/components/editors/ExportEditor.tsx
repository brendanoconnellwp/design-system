import { useRef } from 'react'
import { useDesignSystem } from '../../store/useDesignSystem'
import { Field, Toggle, Segmented } from '../ui'
import { generateCss } from '../../engine/cssGenerator'

export function ExportEditor() {
  const ds = useDesignSystem((s) => s.ds)
  const patch = useDesignSystem((s) => s.patch)
  const exportJson = useDesignSystem((s) => s.exportJson)
  const importJson = useDesignSystem((s) => s.importJson)
  const reset = useDesignSystem((s) => s.reset)
  const fileRef = useRef<HTMLInputElement>(null)
  const e = ds.export

  const download = (name: string, content: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Field label="Output unit">
        <Segmented value={e.unit} onChange={(v) => patch('export', { unit: v })} options={[{ value: 'rem', label: 'rem' }, { value: 'px', label: 'px' }]} />
      </Field>

      <Field label="CSS variable prefix" hint="Namespace every token + class, e.g. ds- → --ds-primary, .ds-p-m.">
        <input type="text" value={e.prefix} placeholder="(none)" onChange={(ev) => patch('export', { prefix: ev.target.value.replace(/[^a-z0-9-]/gi, '') })} />
      </Field>

      <Field label="Selector" hint="Where variables are declared.">
        <input type="text" value={e.selector} onChange={(ev) => patch('export', { selector: ev.target.value || ':root' })} />
      </Field>

      <div>
        <Toggle label="Comments" desc="Group headers in the output." checked={e.includeComments} onChange={(v) => patch('export', { includeComments: v })} />
        <Toggle label="CSS reset" desc="Minimal reset wired to your tokens." checked={e.includeReset} onChange={(v) => patch('export', { includeReset: v })} />
        <Toggle label="Utility classes" desc="Utilities: .p-m, .bg-primary, grid--3…" checked={e.includeUtilities} onChange={(v) => patch('export', { includeUtilities: v })} />
        <Toggle label="Component CSS" desc="Buttons, inputs, cards, etc." checked={e.includeComponents} onChange={(v) => patch('export', { includeComponents: v })} />
      </div>

      <div className="btn-row">
        <button className="s-btn s-btn--primary" onClick={() => download(`${slug(ds.meta.name)}.css`, generateCss(ds), 'text/css')}>
          Download CSS
        </button>
        <button className="s-btn" onClick={() => download(`${slug(ds.meta.name)}.json`, exportJson(), 'application/json')}>
          Export JSON
        </button>
        <button className="s-btn" onClick={() => fileRef.current?.click()}>Import JSON</button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={async (ev) => {
            const f = ev.target.files?.[0]
            if (!f) return
            const ok = importJson(await f.text())
            if (!ok) alert('Invalid design system JSON.')
            ev.target.value = ''
          }}
        />
        <button className="s-btn" onClick={() => { if (confirm('Reset to defaults?')) reset() }}>Reset</button>
      </div>
    </>
  )
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'design-system'
