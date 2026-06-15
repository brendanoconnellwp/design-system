import { useMemo } from 'react'
import { useDesignSystem } from '../../store/useDesignSystem'
import { buildPreviewDoc } from './previewMarkup'

export function PreviewFrame() {
  const ds = useDesignSystem((s) => s.ds)
  const doc = useMemo(() => buildPreviewDoc(ds), [ds])
  return <iframe className="preview-frame" title="Component preview" srcDoc={doc} />
}
