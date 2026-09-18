import { CONSOLE_LINES } from './data'

export function ConsoleDrawer() {
  return (
    <div className="studio-drawer">
      <div className="studio-drawer-tabs">
        <button type="button" data-active={true}>
          Console
        </button>
        <button type="button" data-active={false}>
          History
        </button>
        <span className="studio-drawer-tabs-spacer" />
        <span className="studio-drawer-meta">5 entries</span>
      </div>
      <div className="studio-drawer-body">
        {CONSOLE_LINES.map((line, i) => (
          <div key={i} className="studio-console-line" data-level={line.level}>
            <span className="studio-console-time">{line.time}</span>
            {line.level && <span className="studio-console-badge">{line.level}</span>}
            <span className="studio-console-text" data-level={line.level}>
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
