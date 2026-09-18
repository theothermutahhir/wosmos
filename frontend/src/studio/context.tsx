import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { DEFAULT_STYLES, type NodeStyle, type StudioNodeId } from './data'

interface StudioContextValue {
  selectedId: StudioNodeId
  selectNode: (id: StudioNodeId) => void
  styles: Record<StudioNodeId, NodeStyle>
  setStyle: (id: StudioNodeId, patch: NodeStyle) => void
  registerNode: (id: StudioNodeId, el: HTMLElement | null) => void
  getNodeEl: (id: StudioNodeId) => HTMLElement | null
}

const StudioContext = createContext<StudioContextValue | null>(null)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<StudioNodeId>('h1')
  const [styles, setStyles] = useState<Record<StudioNodeId, NodeStyle>>(DEFAULT_STYLES)
  const nodeRefs = useRef(new Map<StudioNodeId, HTMLElement>())

  const selectNode = useCallback((id: StudioNodeId) => setSelectedId(id), [])

  const setStyle = useCallback((id: StudioNodeId, patch: NodeStyle) => {
    setStyles((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }, [])

  const registerNode = useCallback((id: StudioNodeId, el: HTMLElement | null) => {
    if (el) nodeRefs.current.set(id, el)
    else nodeRefs.current.delete(id)
  }, [])

  const getNodeEl = useCallback((id: StudioNodeId) => nodeRefs.current.get(id) ?? null, [])

  return (
    <StudioContext.Provider value={{ selectedId, selectNode, styles, setStyle, registerNode, getNodeEl }}>
      {children}
    </StudioContext.Provider>
  )
}

export function useStudio() {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used within a StudioProvider')
  return ctx
}
