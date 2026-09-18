import { createElement, useLayoutEffect, useRef, useState } from 'react'
import { useStudio } from './context'
import type { StudioNodeId, NodeStyle } from './data'

function cssStyle(s: NodeStyle): React.CSSProperties {
  return {
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    color: s.color,
    backgroundColor: s.backgroundColor,
    border: s.border,
    borderRadius: s.borderRadius,
    opacity: s.opacity,
  }
}

interface SelectableProps {
  id: StudioNodeId
  as?: string
  className: string
  children: React.ReactNode
  extraStyle?: React.CSSProperties
}

function Selectable({ id, as = 'div', className, children, extraStyle }: SelectableProps) {
  const { selectedId, selectNode, styles, registerNode } = useStudio()
  return createElement(
    as,
    {
      ref: (el: HTMLElement | null) => registerNode(id, el),
      className,
      'data-selected': id === selectedId,
      style: { ...extraStyle, ...cssStyle(styles[id]) },
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        selectNode(id)
      },
    },
    children,
  )
}

export function Canvas() {
  const { selectedId, getNodeEl } = useStudio()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [overlay, setOverlay] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
  const [box, setBox] = useState('—')

  useLayoutEffect(() => {
    const measure = () => {
      const el = getNodeEl(selectedId)
      const scroller = scrollRef.current
      if (!el || !scroller) {
        setOverlay(null)
        setBox('—')
        return
      }
      const elRect = el.getBoundingClientRect()
      const scrollerRect = scroller.getBoundingClientRect()
      setOverlay({
        left: elRect.left - scrollerRect.left + scroller.scrollLeft,
        top: elRect.top - scrollerRect.top + scroller.scrollTop,
        width: elRect.width,
        height: elRect.height,
      })
      setBox(`${Math.round(elRect.width)} × ${Math.round(elRect.height)}`)
    }

    measure()
    window.addEventListener('resize', measure)
    scrollRef.current?.addEventListener('scroll', measure)
    return () => {
      window.removeEventListener('resize', measure)
      scrollRef.current?.removeEventListener('scroll', measure)
    }
  }, [selectedId, getNodeEl])

  return (
    <>
      <div className="studio-canvas-toolbar">
        <span>CANVAS</span>
        <span className="studio-canvas-toolbar-dim">860px</span>
        <span className="studio-canvas-toolbar-spacer" />
        <span>{box} · 100%</span>
      </div>

      <div className="studio-canvas-scroll" ref={scrollRef}>
        {overlay && (
          <div
            style={{
              position: 'absolute',
              left: overlay.left,
              top: overlay.top,
              width: overlay.width,
              height: overlay.height,
              border: '1px solid var(--color-accent)',
              background: 'color-mix(in srgb, var(--color-accent) 9%, transparent)',
              borderRadius: 3,
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
        )}

        <div className="studio-canvas-frame">
          <Selectable id="bar" as="header" className="studio-preview-bar">
            <Selectable id="logo" as="span" className="studio-preview-logo">
              MERIDIAN
            </Selectable>
            <Selectable id="nav" as="nav" className="studio-preview-nav">
              <a href="#work" onClick={(e) => e.preventDefault()}>
                Work
              </a>
              <a href="#studio" onClick={(e) => e.preventDefault()}>
                Studio
              </a>
              <a href="#contact" onClick={(e) => e.preventDefault()}>
                Contact
              </a>
            </Selectable>
          </Selectable>

          <div className="studio-preview-body">
            <Selectable id="h1" as="h1" className="studio-preview-h1">
              Design in the browser, not around it.
            </Selectable>
            <Selectable id="lede" as="p" className="studio-preview-lede">
              Select any element. Its box, type and color land in the inspector — edit them and the canvas
              follows.
            </Selectable>
            <Selectable id="row" as="div" className="studio-preview-row">
              <Selectable id="cta" as="button" className="studio-preview-cta">
                Start a project
              </Selectable>
              <Selectable id="ghost" as="button" className="studio-preview-ghost">
                See the work
              </Selectable>
            </Selectable>
            <Selectable id="cards" as="div" className="studio-preview-cards">
              <article className="studio-preview-card">
                <h3>Identity</h3>
                <p>Marks, type systems, and the rules that hold them together.</p>
              </article>
              <article className="studio-preview-card">
                <h3>Interface</h3>
                <p>Product surfaces built to survive real content.</p>
              </article>
              <article className="studio-preview-card">
                <h3>Motion</h3>
                <p>Timing and easing as part of the brand, not decoration.</p>
              </article>
            </Selectable>
          </div>
        </div>
      </div>
    </>
  )
}
