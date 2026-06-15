import { useDesignSystem } from '../../store/useDesignSystem'
import { Field, NumberField, Slider } from '../ui'

export function GridEditor() {
  const ds = useDesignSystem((s) => s.ds)
  const patch = useDesignSystem((s) => s.patch)
  const L = ds.layout

  const setGap = (k: 'gridGap' | 'contentGap' | 'containerGap', val: string) =>
    patch('layout', { gaps: { ...L.gaps, [k]: val } })

  return (
    <>
      <p className="field__hint" style={{ marginTop: -4 }}>
        Gap tokens drive every grid and flex layout. Enter a pixel value (e.g.{' '}
        <code>16</code>) or a variable reference (e.g. <code>var(--space-m)</code>).
      </p>

      <Field label="--grid-gap" hint="Gap between grid items.">
        <input type="text" value={L.gaps.gridGap} onChange={(e) => setGap('gridGap', e.target.value)} />
      </Field>
      <Field label="--content-gap" hint="Gap between stacked content blocks.">
        <input type="text" value={L.gaps.contentGap} onChange={(e) => setGap('contentGap', e.target.value)} />
      </Field>
      <Field label="--container-gap" hint="Gap between larger container sections.">
        <input type="text" value={L.gaps.containerGap} onChange={(e) => setGap('containerGap', e.target.value)} />
      </Field>

      <hr style={{ border: 0, borderTop: '1px solid var(--s-border)', margin: '4px 0' }} />

      <Field label="Content width" hint="Reference width for the responsive auto-grid math.">
        <input type="text" value={L.contentWidth} onChange={(e) => patch('layout', { contentWidth: e.target.value })} />
      </Field>

      <Field label="Max columns" hint="Generates grid--1…N, grid--auto-2…N.">
        <NumberField value={L.maxColumns} min={2} max={16} onChange={(v) => patch('layout', { maxColumns: Math.round(v) })} />
      </Field>

      <Field label="Auto-grid aggressiveness" hint="Lower = columns collapse sooner on small screens.">
        <Slider value={L.autoGridAggressiveness} min={0.4} max={0.95} step={0.05} onChange={(v) => patch('layout', { autoGridAggressiveness: v })} />
      </Field>

      <Field label="Ready-to-use grids">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['grid--1', 'grid--2', 'grid--3', 'grid--4', '…', 'grid--1-2', 'grid--2-1', 'grid--1-3', 'grid--auto-3', 'grid--auto-4'].map((g) => (
            <code key={g} style={{ fontSize: 11, padding: '3px 7px', background: 'var(--s-panel-2)', border: '1px solid var(--s-border)', borderRadius: 5, color: 'var(--s-muted)' }}>
              {g}
            </code>
          ))}
        </div>
      </Field>
    </>
  )
}
