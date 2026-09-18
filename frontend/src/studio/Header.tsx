import { DEVICES } from './data'

export function Header() {
  return (
    <header className="studio-header">
      <div className="studio-header-brand">
        <div className="studio-header-dot" />
        <span className="studio-header-title">Style Studio</span>
        <span className="studio-header-file">meridian.html</span>
      </div>

      <div className="studio-header-divider" />

      <div className="studio-header-history">
        <button type="button" className="studio-icon-btn" title="Undo">
          ‹
        </button>
        <button type="button" className="studio-icon-btn" title="Redo">
          ›
        </button>
        <span className="studio-header-history-label">12 edits</span>
      </div>

      <div className="studio-header-spacer" />

      <div className="studio-toggle-group">
        {DEVICES.map((d) => (
          <button key={d.id} type="button" data-active={d.id === 'full'}>
            {d.label}
          </button>
        ))}
      </div>

      <div className="studio-toggle-group">
        <button type="button" data-active={true}>
          Light
        </button>
        <button type="button" data-active={false}>
          Dark
        </button>
      </div>

      <button type="button" className="btn btn-primary" style={{ fontSize: 11.5, padding: '5px 14px' }}>
        Publish
      </button>
    </header>
  )
}
