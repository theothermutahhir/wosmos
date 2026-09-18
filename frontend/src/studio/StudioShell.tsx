import { Header } from './Header'
import { ElementTree } from './ElementTree'
import { StyleInspector } from './StyleInspector'
import { Canvas } from './Canvas'
import { ConsoleDrawer } from './ConsoleDrawer'
import { CodePanel } from './CodePanel'
import { StudioProvider } from './context'
import './studio.css'

export function StudioShell() {
  return (
    <StudioProvider>
      <div className="studio">
        <Header />
        <div className="studio-body">
          <aside className="studio-sidebar-left">
            <ElementTree />
            <StyleInspector />
          </aside>
          <main className="studio-main">
            <Canvas />
            <ConsoleDrawer />
          </main>
          <CodePanel />
        </div>
      </div>
    </StudioProvider>
  )
}
