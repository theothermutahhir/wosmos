import { NODES, SELECTED_NODE_ID } from './data'

export function ElementTree() {
  const selected = NODES.find((n) => n.id === SELECTED_NODE_ID)!

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
            data-selected={n.id === SELECTED_NODE_ID}
            style={{ paddingLeft: 6 + (n.depth - 1) * 14 }}
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
          <span className="studio-selection-box">{selected.box}</span>
        </div>
        <div className="studio-selection-path">{selected.path}</div>
      </div>
    </>
  )
}
