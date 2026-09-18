import { NODES } from './data'
import { useStudio } from './context'

export function ElementTree() {
  const { selectedId, selectNode, getNodeEl } = useStudio()
  const selected = NODES.find((n) => n.id === selectedId)!
  const el = getNodeEl(selectedId)
  const box = el ? `${Math.round(el.offsetWidth)} × ${Math.round(el.offsetHeight)}` : '—'

  return (
    <>
      <div className="studio-panel-label">
        <span>Elements</span>
        <span className="studio-panel-label-rule" />
      </div>

      <div className="studio-tree">
        {NODES.map((n) => (
          <button
            key={n.id}
            type="button"
            className="studio-tree-row"
            data-selected={n.id === selectedId}
            style={{ paddingLeft: 6 + (n.depth - 1) * 14 }}
            onClick={() => selectNode(n.id)}
          >
            <span>{n.tag}</span>
            {n.cls && <span className="studio-tree-row-cls">{n.cls}</span>}
          </button>
        ))}
      </div>

      <div className="studio-selection-summary">
        <div className="studio-panel-label" style={{ padding: 0 }}>
          <span>Styles</span>
          <span className="studio-panel-label-rule" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0 }}>
          <span className="studio-selection-label">
            {selected.tag}
            {selected.cls}
          </span>
          <span className="studio-selection-box">{box}</span>
        </div>
        <div className="studio-selection-path">{selected.path}</div>
      </div>
    </>
  )
}
