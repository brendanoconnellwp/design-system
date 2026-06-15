import { useDesignSystem } from '../../store/useDesignSystem'
import { Field } from '../ui'

export function EffectsEditor() {
  const ds = useDesignSystem((s) => s.ds)
  const patch = useDesignSystem((s) => s.patch)

  return (
    <>
      <Field label="Border radius">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ds.radius.steps.map((r) => (
            <div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <code style={{ width: 70, fontSize: 12, color: 'var(--s-muted)' }}>radius-{r.key}</code>
              {r.key === 'full' ? (
                <span className="field__hint">9999px (pill)</span>
              ) : (
                <>
                  <input
                    type="number"
                    value={r.px}
                    min={0}
                    onChange={(e) =>
                      patch('radius', {
                        steps: ds.radius.steps.map((x) => (x.key === r.key ? { ...x, px: parseFloat(e.target.value) || 0 } : x)),
                      })
                    }
                    style={{ width: 90 }}
                  />
                  <span className="field__hint">px</span>
                </>
              )}
            </div>
          ))}
        </div>
      </Field>

      <Field label="Shadows" hint="Edit raw box-shadow values.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ds.shadow.steps.map((s) => (
            <div key={s.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <code style={{ fontSize: 12, color: 'var(--s-muted)' }}>shadow-{s.key}</code>
              <input
                type="text"
                value={s.value}
                onChange={(e) =>
                  patch('shadow', { steps: ds.shadow.steps.map((x) => (x.key === s.key ? { ...x, value: e.target.value } : x)) })
                }
                style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11 }}
              />
            </div>
          ))}
        </div>
      </Field>

      <Field label="Motion durations">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ds.motion.durations.map((d) => (
            <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <code style={{ width: 70, fontSize: 12, color: 'var(--s-muted)' }}>{d.key}</code>
              <input
                type="number"
                value={d.ms}
                min={0}
                step={10}
                onChange={(e) =>
                  patch('motion', { durations: ds.motion.durations.map((x) => (x.key === d.key ? { ...x, ms: parseFloat(e.target.value) || 0 } : x)) })
                }
                style={{ width: 90 }}
              />
              <span className="field__hint">ms</span>
            </div>
          ))}
        </div>
      </Field>
    </>
  )
}
