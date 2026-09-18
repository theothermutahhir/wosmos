import { SELECTED_NODE_ID } from './data'

export function Canvas() {
  return (
    <>
      <div className="studio-canvas-toolbar">
        <span>CANVAS</span>
        <span className="studio-canvas-toolbar-dim">860px</span>
        <span className="studio-canvas-toolbar-spacer" />
        <span>486 × 86 · 100%</span>
      </div>

      <div className="studio-canvas-scroll">
        <div className="studio-canvas-frame">
          <div className="studio-preview-bar">
            <span className="studio-preview-logo">MERIDIAN</span>
            <nav className="studio-preview-nav">
              <a href="#work">Work</a>
              <a href="#studio">Studio</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
          <div className="studio-preview-body">
            <h1 className="studio-preview-h1" data-selected={SELECTED_NODE_ID === 'h1'}>
              Design in the browser, not around it.
            </h1>
            <p className="studio-preview-lede">
              Select any element. Its box, type and color land in the inspector — edit them and the canvas
              follows.
            </p>
            <div className="studio-preview-row">
              <button type="button" className="studio-preview-cta">
                Start a project
              </button>
              <button type="button" className="studio-preview-ghost">
                See the work
              </button>
            </div>
            <div className="studio-preview-cards">
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
