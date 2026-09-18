import { INSPECTOR_SECTIONS } from './data'

export function StyleInspector() {
  return (
    <div className="studio-inspector">
      {INSPECTOR_SECTIONS.map((section) => (
        <div key={section.id}>
          <button type="button" className="studio-inspector-section-header">
            <span className="studio-inspector-caret">{section.open ? '▾' : '▸'}</span>
            {section.label}
          </button>
          {section.open && (
            <div className="studio-inspector-fields">
              {section.fields.map((field) => (
                <label key={field.label} className="studio-field">
                  <span className="studio-field-label">{field.label}</span>
                  <input className="studio-field-value" defaultValue={field.value} readOnly />
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
