import { useEffect, useState } from 'react'
import { useStudio } from './context'
import type { NodeStyle } from './data'

interface EditableField {
  key: keyof NodeStyle
  label: string
  kind: 'text' | 'number' | 'color'
  suffix?: string
}

const SECTIONS: { id: string; label: string; fields: EditableField[] }[] = [
  {
    id: 'type',
    label: 'Typography',
    fields: [
      { key: 'fontSize', label: 'size', kind: 'number', suffix: 'px' },
      { key: 'fontWeight', label: 'weight', kind: 'number' },
      { key: 'color', label: 'color', kind: 'color' },
    ],
  },
  {
    id: 'fill',
    label: 'Fill & border',
    fields: [
      { key: 'backgroundColor', label: 'fill', kind: 'color' },
      { key: 'border', label: 'border', kind: 'text' },
      { key: 'borderRadius', label: 'radius', kind: 'number', suffix: 'px' },
    ],
  },
  {
    id: 'effects',
    label: 'Effects',
    fields: [{ key: 'opacity', label: 'opacity', kind: 'number' }],
  },
]

const COMPUTED_SECTIONS: { id: string; label: string; props: string[] }[] = [
  { id: 'layout', label: 'Layout', props: ['display', 'overflow'] },
  { id: 'box', label: 'Box model', props: ['width', 'height', 'margin', 'padding'] },
  { id: 'position', label: 'Position', props: ['position', 'zIndex'] },
  { id: 'motion', label: 'Transitions & animation', props: ['transitionProperty', 'transitionDuration'] },
]

export function StyleInspector() {
  const { selectedId, styles, setStyle, getNodeEl } = useStudio()
  const [open, setOpen] = useState<Record<string, boolean>>({
    type: true,
    fill: true,
    effects: true,
    layout: false,
    box: true,
    position: false,
    motion: false,
  })
  const [computed, setComputed] = useState<Record<string, string>>({})

  useEffect(() => {
    const el = getNodeEl(selectedId)
    if (!el) return
    const cs = window.getComputedStyle(el)
    const next: Record<string, string> = {}
    for (const section of COMPUTED_SECTIONS) {
      for (const prop of section.props) {
        next[prop] = cs.getPropertyValue(prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`))
      }
    }
    setComputed(next)
  }, [selectedId, getNodeEl])

  const style = styles[selectedId]
  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }))

  return (
    <div className="studio-inspector">
      {SECTIONS.map((section) => (
        <div key={section.id}>
          <button type="button" className="studio-inspector-section-header" onClick={() => toggle(section.id)}>
            <span className="studio-inspector-caret">{open[section.id] ? '▾' : '▸'}</span>
            {section.label}
          </button>
          {open[section.id] && (
            <div className="studio-inspector-fields">
              {section.fields.map((field) => (
                <label key={field.key} className="studio-field">
                  <span className="studio-field-label">{field.label}</span>
                  <input
                    className="studio-field-value"
                    type={field.kind === 'color' ? 'text' : field.kind}
                    value={style[field.key] ?? ''}
                    onChange={(e) => {
                      const raw = e.target.value
                      setStyle(selectedId, {
                        [field.key]: field.kind === 'number' ? (raw === '' ? undefined : Number(raw)) : raw,
                      })
                    }}
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {COMPUTED_SECTIONS.map((section) => (
        <div key={section.id}>
          <button type="button" className="studio-inspector-section-header" onClick={() => toggle(section.id)}>
            <span className="studio-inspector-caret">{open[section.id] ? '▾' : '▸'}</span>
            {section.label}
          </button>
          {open[section.id] && (
            <div className="studio-inspector-fields">
              {section.props.map((prop) => (
                <label key={prop} className="studio-field">
                  <span className="studio-field-label">{prop}</span>
                  <input className="studio-field-value" value={computed[prop] ?? ''} readOnly disabled />
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
