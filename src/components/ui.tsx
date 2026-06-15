import type { ReactNode } from 'react'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <span className="field__hint">{hint}</span>}
    </div>
  )
}

export function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string
  desc?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="toggle">
      <span>
        {label}
        {desc && <small>{desc}</small>}
      </span>
      <span className="switch-ui">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <i />
      </span>
    </label>
  )
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.value} className={value === o.value ? 'active' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function NumberField({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
}) {
  return (
    <div className="field__row">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
      {suffix && <span className="field__hint">{suffix}</span>}
    </div>
  )
}

export function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
}) {
  return (
    <div className="field__row">
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
      <span className="field__hint" style={{ minWidth: 44, textAlign: 'right' }}>{value}</span>
    </div>
  )
}
