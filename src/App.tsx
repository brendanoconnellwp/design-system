import { useState } from 'react'
import { useDesignSystem } from './store/useDesignSystem'
import { ColorEditor } from './components/editors/ColorEditor'
import { TypographyEditor } from './components/editors/TypographyEditor'
import { SpacingEditor } from './components/editors/SpacingEditor'
import { GridEditor } from './components/editors/GridEditor'
import { EffectsEditor } from './components/editors/EffectsEditor'
import { ExportEditor } from './components/editors/ExportEditor'
import { PreviewFrame } from './components/preview/PreviewFrame'
import { CodePanel } from './components/CodePanel'

type Section = 'colors' | 'typography' | 'spacing' | 'grids' | 'effects' | 'export'

const SECTIONS: { id: Section; label: string; icon: string; title: string; desc: string }[] = [
  { id: 'colors', label: 'Colors', icon: '◐', title: 'Colors', desc: 'Brand & semantic colors with auto-generated shades and transparency.' },
  { id: 'typography', label: 'Typography', icon: 'A', title: 'Typography', desc: 'Fluid type scale, fonts, and weights.' },
  { id: 'spacing', label: 'Spacing', icon: '⇿', title: 'Spacing & layout', desc: 'Fluid spacing scale and the clamp viewport window.' },
  { id: 'grids', label: 'Grids & gaps', icon: '▦', title: 'Grids & gaps', desc: 'Gap tokens, ready-made column/ratio grids, and responsive auto-grids.' },
  { id: 'effects', label: 'Effects', icon: '✦', title: 'Radius, shadows & motion', desc: 'Surface and animation tokens.' },
  { id: 'export', label: 'Export', icon: '↧', title: 'Export', desc: 'Choose what ships, then copy or download.' },
]

export function App() {
  const [section, setSection] = useState<Section>('colors')
  const [view, setView] = useState<'preview' | 'code'>('preview')
  const dsName = useDesignSystem((s) => s.ds.meta.name)
  const replace = useDesignSystem((s) => s.replace)
  const ds = useDesignSystem((s) => s.ds)
  const meta = SECTIONS.find((s) => s.id === section)!

  return (
    <div className="studio">
      <nav className="nav">
        <div className="nav__brand">
          <div className="nav__logo" />
          <div>
            <b>DS Studio</b>
            <span>token generator</span>
          </div>
        </div>
        {SECTIONS.map((s) => (
          <button key={s.id} className={section === s.id ? 'active' : ''} onClick={() => setSection(s.id)}>
            <span style={{ width: 16, textAlign: 'center', fontWeight: 700 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
        <div className="nav__spacer" />
        <div className="nav__foot">
          <input
            type="text"
            value={dsName}
            onChange={(e) => replace({ ...ds, meta: { ...ds.meta, name: e.target.value } })}
            aria-label="Design system name"
          />
        </div>
      </nav>

      <section className="editor">
        <div className="editor__head">
          <h2>{meta.title}</h2>
          <p>{meta.desc}</p>
        </div>
        <div className="editor__body">
          {section === 'colors' && <ColorEditor />}
          {section === 'typography' && <TypographyEditor />}
          {section === 'spacing' && <SpacingEditor />}
          {section === 'grids' && <GridEditor />}
          {section === 'effects' && <EffectsEditor />}
          {section === 'export' && <ExportEditor />}
        </div>
      </section>

      <main className="main">
        <div className="main__bar">
          <div className="seg">
            <button className={view === 'preview' ? 'active' : ''} onClick={() => setView('preview')}>Preview</button>
            <button className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Code</button>
          </div>
          <span className="spacer" />
          <span className="field__hint">Live · updates as you edit</span>
        </div>
        {view === 'preview' ? (
          <div className="preview-wrap">
            <PreviewFrame />
          </div>
        ) : (
          <CodePanel />
        )}
      </main>
    </div>
  )
}
