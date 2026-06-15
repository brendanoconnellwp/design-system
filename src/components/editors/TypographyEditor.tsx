import { useDesignSystem } from '../../store/useDesignSystem'
import { generateTypeScale } from '../../engine/typography'
import { Field, NumberField, Slider } from '../ui'

const RATIOS = [
  { v: 1.125, n: 'Major second' },
  { v: 1.2, n: 'Minor third' },
  { v: 1.25, n: 'Major third' },
  { v: 1.333, n: 'Perfect fourth' },
  { v: 1.414, n: 'Augmented fourth' },
  { v: 1.5, n: 'Perfect fifth' },
  { v: 1.618, n: 'Golden ratio' },
]

export function TypographyEditor() {
  const ds = useDesignSystem((s) => s.ds)
  const patch = useDesignSystem((s) => s.patch)
  const t = ds.typography
  const scale = generateTypeScale(t, ds.fluid)

  return (
    <>
      <Field label="Base font size" hint="Reference size that 1rem maps to.">
        <NumberField value={t.baseSizePx} onChange={(v) => patch('typography', { baseSizePx: v })} min={12} max={24} suffix="px" />
      </Field>

      <Field label="Type scale ratio">
        <select value={t.scaleRatio} onChange={(e) => patch('typography', { scaleRatio: parseFloat(e.target.value) })}>
          {RATIOS.map((r) => (
            <option key={r.v} value={r.v}>{r.n} — {r.v}</option>
          ))}
        </select>
      </Field>

      <Field label="Mobile scale ratio" hint="Gentler ratio at the small viewport so headings don't blow out on phones.">
        <Slider value={t.minScaleRatio} min={1.05} max={t.scaleRatio} step={0.01} onChange={(v) => patch('typography', { minScaleRatio: v })} />
      </Field>

      <Field label="Heading font">
        <input type="text" value={t.fonts.heading} onChange={(e) => patch('typography', { fonts: { ...t.fonts, heading: e.target.value } })} />
      </Field>
      <Field label="Body font">
        <input type="text" value={t.fonts.body} onChange={(e) => patch('typography', { fonts: { ...t.fonts, body: e.target.value } })} />
      </Field>
      <Field label="Mono font">
        <input type="text" value={t.fonts.mono} onChange={(e) => patch('typography', { fonts: { ...t.fonts, mono: e.target.value } })} />
      </Field>

      <Field label="Generated scale (fluid clamp)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {scale.map((s) => (
            <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--s-muted)', fontFamily: 'ui-monospace, monospace' }}>
              <span>--text-{s.key}</span>
              <span>{s.minRem}→{s.maxRem}rem</span>
            </div>
          ))}
        </div>
      </Field>
    </>
  )
}
