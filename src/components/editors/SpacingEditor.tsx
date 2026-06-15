import { useDesignSystem } from '../../store/useDesignSystem'
import { Field, NumberField } from '../ui'

export function SpacingEditor() {
  const ds = useDesignSystem((s) => s.ds)
  const patch = useDesignSystem((s) => s.patch)
  const sp = ds.spacing

  const setFactor = (key: string, factor: number) =>
    patch('spacing', { steps: sp.steps.map((s) => (s.key === key ? { ...s, factor } : s)) })

  return (
    <>
      <Field label="Base spacing unit" hint="--space-m anchors the scale; others are multiples of the base rem.">
        <NumberField value={sp.baseRem} onChange={(v) => patch('spacing', { baseRem: v })} min={0.25} max={4} step={0.25} suffix="rem" />
      </Field>

      <Field label="Fluid viewport window" hint="clamp() interpolates spacing & type between these widths.">
        <div className="field__row">
          <NumberField value={ds.fluid.minViewportPx} onChange={(v) => patch('fluid', { minViewportPx: v })} suffix="px min" />
          <NumberField value={ds.fluid.maxViewportPx} onChange={(v) => patch('fluid', { maxViewportPx: v })} suffix="px max" />
        </div>
      </Field>

      <Field label="Steps (× base)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sp.steps.map((s) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <code style={{ width: 70, fontSize: 12, color: 'var(--s-muted)' }}>space-{s.key}</code>
              <input type="number" value={s.factor} step={0.25} min={0} onChange={(e) => setFactor(s.key, parseFloat(e.target.value) || 0)} style={{ width: 90 }} />
              <span className="field__hint">{(s.factor * sp.baseRem).toFixed(2)}rem</span>
            </div>
          ))}
        </div>
      </Field>
    </>
  )
}
