import { useMemo, useState } from 'react'
import { useDesignSystem } from '../store/useDesignSystem'
import { generateCss } from '../engine/cssGenerator'

export function CodePanel() {
  const ds = useDesignSystem((s) => s.ds)
  const [copied, setCopied] = useState(false)
  const css = useMemo(() => generateCss(ds), [ds])

  const copy = async () => {
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="code">
      <div className="main__bar">
        <h3>Production CSS</h3>
        <span className="field__hint">{css.split('\n').length} lines · {(css.length / 1024).toFixed(1)} KB</span>
        <span className="spacer" />
        <button className="s-btn s-btn--primary" onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
      </div>
      <pre><code>{css}</code></pre>
    </div>
  )
}
