import { useCallback, useEffect, useRef, useState } from 'react'
import CodeMirror, { EditorView, type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'
import { useStudio } from './context'
import { NODES, type StudioNodeId } from './data'
import { DEMO_HTML, findNodeInCss, findNodeInHtml, findRangeForNode } from './sourceSync'

type Tab = 'html' | 'css' | 'js'

const TABS: { id: Tab; label: string }[] = [
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'js', label: 'JS' },
]

const JS_SOURCE = `// canvas behaviour
const cta = document.querySelector('.cta');

cta.addEventListener('click', () => {
  cta.animate([...], { duration: 180 });
});`

function buildCss(styles: ReturnType<typeof useStudio>['styles']): string {
  return NODES.filter((n) => n.cls)
    .map((n) => {
      const s = styles[n.id]
      const decls = Object.entries(s)
        .map(([k, v]) => {
          const prop = k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
          const unit = k === 'fontSize' || k === 'borderRadius' ? 'px' : ''
          return `  ${prop}: ${v}${unit};`
        })
        .join('\n')
      return `${n.cls} {\n${decls}\n}`
    })
    .join('\n\n')
}

// Matches the syntax colors from the original Style Studio mockup, not
// CodeMirror's defaults.
const nocturneHighlight = HighlightStyle.define([
  { tag: [t.tagName, t.className], color: '#b5abfc' },
  { tag: [t.attributeName, t.propertyName, t.definition(t.propertyName)], color: '#9690c9' },
  { tag: [t.string, t.attributeValue], color: '#9fd0c0' },
  { tag: [t.comment, t.blockComment, t.lineComment], color: '#595d6c', fontStyle: 'italic' },
  { tag: [t.number, t.unit, t.keyword, t.literal, t.bool, t.atom, t.color], color: '#d2cefd' },
  { tag: [t.punctuation, t.bracket, t.angleBracket, t.operator], color: '#75798c' },
  { tag: [t.variableName, t.definition(t.variableName)], color: '#e9e9ed' },
])

const darkTheme = EditorView.theme(
  {
    '&': { backgroundColor: 'var(--chrome-input-bg)', height: '100%', fontSize: '11.5px' },
    '.cm-content': { fontFamily: 'var(--font-mono)', caretColor: 'var(--color-accent)', color: '#cfd3e5' },
    '.cm-gutters': { backgroundColor: 'var(--chrome-gutter-bg)', color: 'var(--color-neutral-800)', border: 'none' },
    '.cm-activeLine': { backgroundColor: 'color-mix(in srgb, var(--color-text) 5%, transparent)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent' },
    '&.cm-focused': { outline: 'none' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: 'color-mix(in srgb, var(--color-accent) 25%, transparent) !important',
    },
    '.cm-cursor': { borderLeftColor: 'var(--color-accent)' },
  },
  { dark: true },
)

export function CodePanel() {
  const [tab, setTab] = useState<Tab>('html')
  const { selectedId, selectNode, styles } = useStudio()
  const htmlRef = useRef<ReactCodeMirrorRef>(null)
  const editorDrivenRef = useRef(false)
  const cssSource = buildCss(styles)

  // Cursor moved in the HTML editor -> best-effort select the node it's in.
  const handleHtmlUpdate = useCallback(
    (viewUpdate: import('@codemirror/view').ViewUpdate) => {
      if (!viewUpdate.selectionSet) return
      const offset = viewUpdate.state.selection.main.head
      const doc = viewUpdate.state.doc.toString()
      findNodeInHtml(doc, offset).then((found) => {
        if (found && found !== selectedId) {
          editorDrivenRef.current = true
          selectNode(found)
        }
      })
    },
    [selectNode, selectedId],
  )

  const handleCssUpdate = useCallback(
    (viewUpdate: import('@codemirror/view').ViewUpdate) => {
      if (!viewUpdate.selectionSet) return
      const offset = viewUpdate.state.selection.main.head
      const doc = viewUpdate.state.doc.toString()
      findNodeInCss(doc, offset).then((found) => {
        if (found && found !== selectedId) selectNode(found)
      })
    },
    [selectNode, selectedId],
  )

  // Selection changed elsewhere (tree/canvas) -> move the HTML cursor there.
  useEffect(() => {
    if (editorDrivenRef.current) {
      editorDrivenRef.current = false
      return
    }
    const view = htmlRef.current?.view
    if (!view || tab !== 'html') return
    let cancelled = false
    findRangeForNode(DEMO_HTML, selectedId as StudioNodeId).then((range) => {
      if (cancelled || !range) return
      view.dispatch({
        selection: { anchor: range.start, head: range.end },
        scrollIntoView: true,
      })
    })
    return () => {
      cancelled = true
    }
  }, [selectedId, tab])

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

      <div className="studio-code-body studio-code-editor">
        {tab === 'html' && (
          <CodeMirror
            ref={htmlRef}
            value={DEMO_HTML}
            theme={darkTheme}
            extensions={[html(), syntaxHighlighting(nocturneHighlight)]}
            onUpdate={handleHtmlUpdate}
            height="100%"
          />
        )}
        {tab === 'css' && (
          <CodeMirror
            value={cssSource}
            theme={darkTheme}
            extensions={[css(), syntaxHighlighting(nocturneHighlight)]}
            onUpdate={handleCssUpdate}
            height="100%"
          />
        )}
        {tab === 'js' && (
          <CodeMirror
            value={JS_SOURCE}
            theme={darkTheme}
            extensions={[html(), syntaxHighlighting(nocturneHighlight)]}
            height="100%"
            editable={false}
          />
        )}
      </div>

      <div className="studio-code-footer">
        <span>meridian.html</span>
        <span className="studio-code-footer-spacer" />
        <span className="studio-code-footer-dot">●</span>
        <span>click a tag to select it</span>
      </div>
    </section>
  )
}
