import { useDesignSystem } from '../../store/useDesignSystem'
import { generateColor, SHADE_RUNGS } from '../../engine/color'
import { Field, Toggle, Slider, Segmented } from '../ui'

export function ColorEditor() {
  const ds = useDesignSystem((s) => s.ds)
  const setColorHex = useDesignSystem((s) => s.setColorHex)
  const patch = useDesignSystem((s) => s.patch)
  const { color } = ds

  return (
    <>
      <p className="field__hint" style={{ marginTop: -4 }}>
        Enter one brand hex per color — the full shade ladder, transparency steps,
        hover and accessible-contrast variants are generated automatically.
      </p>

      <Field label="Output format" hint="HSL links every shade to one base via --h/--s/--l, so changing the hex recomputes the whole ladder. Hex bakes static values.">
        <Segmented
          value={ds.export.colorFormat}
          onChange={(v) => patch('export', { colorFormat: v })}
          options={[{ value: 'hsl', label: 'HSL (linked)' }, { value: 'hex', label: 'Static hex' }]}
        />
      </Field>

      {color.brand.map((c) => {
        const out = generateColor(c, color)
        return (
          <div key={c.key} className="swatch-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="color"
                value={c.hex}
                onChange={(e) => setColorHex(c.key, e.target.value)}
                aria-label={`${c.label} color`}
              />
              <div className="swatch-row__label">
                <b>{c.label}</b>
                <code>--{ds.export.prefix}{c.key}</code>
              </div>
              <input
                type="text"
                value={c.hex}
                onChange={(e) => setColorHex(c.key, e.target.value)}
                style={{ width: 96, fontFamily: 'ui-monospace, monospace' }}
              />
            </div>
            <div className="shade-ladder" title="ultra-light → ultra-dark">
              {SHADE_RUNGS.map((s) => (
                <div key={s} style={{ background: out.shades[s] }} title={`${c.key}-${s}: ${out.shades[s]}`} />
              ))}
            </div>
          </div>
        )
      })}

      <hr style={{ border: 0, borderTop: '1px solid var(--s-border)', margin: '4px 0' }} />

      <Field label="Shade lightness targets" hint="Hue + saturation stay fixed; each rung is pinned to this lightness (%).">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {(
            [
              ['ultraLight', 'Ultra light'],
              ['light', 'Light'],
              ['semiLight', 'Semi light'],
              ['semiDark', 'Semi dark'],
              ['dark', 'Dark'],
              ['ultraDark', 'Ultra dark'],
            ] as const
          ).map(([k, label]) => (
            <div key={k}>
              <span className="field__hint">{label} — {color.lightness[k]}%</span>
              <Slider
                value={color.lightness[k]}
                min={0}
                max={100}
                onChange={(val) => patch('color', { lightness: { ...color.lightness, [k]: val } })}
              />
            </div>
          ))}
          <span className="field__hint">Hover (base L + {color.hoverDelta}%)</span>
          <Slider value={color.hoverDelta} min={-20} max={20} onChange={(v) => patch('color', { hoverDelta: v })} />
        </div>
      </Field>

      <Toggle
        label="Numeric scale (50–950)"
        desc="Also emit a Tailwind-style numeric ladder per color."
        checked={color.numericScale}
        onChange={(v) => patch('color', { numericScale: v })}
      />
    </>
  )
}
