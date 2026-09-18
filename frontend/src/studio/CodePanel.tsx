import { useState } from 'react'

type Tab = 'html' | 'css' | 'js'

const TABS: { id: Tab; label: string }[] = [
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'js', label: 'JS' },
]

const SOURCES: Record<Tab, { lines: number; node: React.ReactNode }> = {
  html: {
    lines: 16,
    node: (
      <>
        {'<'}
        <span className="studio-code-tag">header</span> <span className="studio-code-attr">class</span>=
        <span className="studio-code-string">"bar"</span>
        {'>\n  <'}
        <span className="studio-code-tag">span</span> <span className="studio-code-attr">class</span>=
        <span className="studio-code-string">"logo"</span>
        {'>MERIDIAN</'}
        <span className="studio-code-tag">span</span>
        {'>\n  <'}
        <span className="studio-code-tag">nav</span>
        {'>\n    <'}
        <span className="studio-code-tag">a</span> <span className="studio-code-attr">href</span>=
        <span className="studio-code-string">"#"</span>
        {'>Work</'}
        <span className="studio-code-tag">a</span>
        {'>\n    <'}
        <span className="studio-code-tag">a</span> <span className="studio-code-attr">href</span>=
        <span className="studio-code-string">"#"</span>
        {'>Studio</'}
        <span className="studio-code-tag">a</span>
        {'>\n    <'}
        <span className="studio-code-tag">a</span> <span className="studio-code-attr">href</span>=
        <span className="studio-code-string">"#"</span>
        {'>Contact</'}
        <span className="studio-code-tag">a</span>
        {'>\n  </'}
        <span className="studio-code-tag">nav</span>
        {'>\n</'}
        <span className="studio-code-tag">header</span>
        {'>\n\n<'}
        <span className="studio-code-tag">main</span>
        {'>\n  <'}
        <span className="studio-code-tag">h1</span>
        {'>Design in the browser,\n      not around it.</'}
        <span className="studio-code-tag">h1</span>
        {'>\n  <'}
        <span className="studio-code-tag">p</span> <span className="studio-code-attr">class</span>=
        <span className="studio-code-string">"lede"</span>
        {'>Select any element…</'}
        <span className="studio-code-tag">p</span>
        {'>\n</'}
        <span className="studio-code-tag">main</span>
        {'>'}
      </>
    ),
  },
  css: {
    lines: 15,
    node: (
      <>
        <span className="studio-code-comment">{'/* tokens */'}</span>
        {'\n'}
        <span className="studio-code-tag">:root</span>
        {' {\n  '}
        <span className="studio-code-prop">--ink</span>
        {': '}
        <span className="studio-code-string">#16181d</span>
        {';\n  '}
        <span className="studio-code-prop">--paper</span>
        {': '}
        <span className="studio-code-string">#f4f3ef</span>
        {';\n  '}
        <span className="studio-code-prop">--accent</span>
        {': '}
        <span className="studio-code-string">#3b5bdb</span>
        {';\n}\n\n'}
        <span className="studio-code-tag">.cta</span>
        {' {\n  '}
        <span className="studio-code-prop">background</span>
        {': '}
        <span className="studio-code-tag">var</span>
        {'('}
        <span className="studio-code-prop">--accent</span>
        {');\n  '}
        <span className="studio-code-prop">color</span>
        {': '}
        <span className="studio-code-string">#fff</span>
        {';\n  '}
        <span className="studio-code-prop">border-radius</span>
        {': '}
        <span className="studio-code-value">6px</span>
        {';\n  '}
        <span className="studio-code-prop">transition</span>
        {': transform '}
        <span className="studio-code-value">120ms</span>
        {' ease;\n}'}
      </>
    ),
  },
  js: {
    lines: 8,
    node: (
      <>
        <span className="studio-code-comment">{'// canvas behaviour'}</span>
        {'\nconst cta = document.querySelector('}
        <span className="studio-code-string">'.cta'</span>
        {');\n\ncta.addEventListener('}
        <span className="studio-code-string">'click'</span>
        {', () => {\n  cta.animate([...], { duration: '}
        <span className="studio-code-value">180</span>
        {' });\n});'}
      </>
    ),
  },
}

export function CodePanel() {
  const [tab, setTab] = useState<Tab>('html')
  const source = SOURCES[tab]

  return (
    <section className="studio-code-panel">
      <div className="studio-code-tabs">
        {TABS.map((t) => (
          <button key={t.id} type="button" data-active={t.id === tab} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
        <div className="studio-code-tabs-fill" />
      </div>

      <div className="studio-code-body">
        <pre className="studio-code-gutter">
          {Array.from({ length: source.lines }, (_, i) => i + 1).join('\n')}
        </pre>
        <pre className="studio-code-source">{source.node}</pre>
      </div>

      <div className="studio-code-footer">
        <span>meridian.html</span>
        <span className="studio-code-footer-spacer" />
        <span className="studio-code-footer-dot">●</span>
        <span>12 edits</span>
      </div>
    </section>
  )
}
