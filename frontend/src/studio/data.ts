// Node metadata + default styles for the "Meridian" demo page rendered in
// the canvas. This is the single source of truth the tree, canvas, code
// panel, and inspector all read from, so selecting/editing stays in sync
// across them.

export type StudioNodeId = 'bar' | 'logo' | 'nav' | 'h1' | 'lede' | 'row' | 'cta' | 'ghost' | 'cards'

export interface StudioNode {
  id: StudioNodeId
  depth: number
  tag: string
  cls: string
  path: string
}

export const NODES: StudioNode[] = [
  { id: 'bar', depth: 1, tag: 'header', cls: '.bar', path: 'body › header.bar' },
  { id: 'logo', depth: 2, tag: 'span', cls: '.logo', path: 'header.bar › span.logo' },
  { id: 'nav', depth: 2, tag: 'nav', cls: '', path: 'header.bar › nav' },
  { id: 'h1', depth: 2, tag: 'h1', cls: '', path: 'main › h1' },
  { id: 'lede', depth: 2, tag: 'p', cls: '.lede', path: 'main › p.lede' },
  { id: 'row', depth: 2, tag: 'div', cls: '.row', path: 'main › div.row' },
  { id: 'cta', depth: 3, tag: 'button', cls: '.cta', path: 'div.row › button.cta' },
  { id: 'ghost', depth: 3, tag: 'button', cls: '.ghost', path: 'div.row › button.ghost' },
  { id: 'cards', depth: 2, tag: 'div', cls: '.cards', path: 'main › div.cards' },
]

// The subset of style properties the inspector's Typography / Fill & Border
// / Effects sections can actually edit. Layout, box model, position, and
// motion stay read-only (computed) for this pass.
export interface NodeStyle {
  fontSize?: number
  fontWeight?: number
  color?: string
  backgroundColor?: string
  border?: string
  borderRadius?: number
  opacity?: number
}

export const DEFAULT_STYLES: Record<StudioNodeId, NodeStyle> = {
  bar: { backgroundColor: 'transparent', opacity: 1 },
  logo: { color: '#16181d', fontSize: 14, fontWeight: 600, opacity: 1 },
  nav: { opacity: 1 },
  h1: { color: '#16181d', fontSize: 40, fontWeight: 500, opacity: 1 },
  lede: { color: '#5c5f68', fontSize: 16, fontWeight: 400, opacity: 1 },
  row: { opacity: 1 },
  cta: {
    color: '#ffffff',
    backgroundColor: '#3b5bdb',
    border: '1px solid #3b5bdb',
    borderRadius: 6,
    fontSize: 13.5,
    fontWeight: 500,
    opacity: 1,
  },
  ghost: {
    color: '#16181d',
    backgroundColor: 'transparent',
    border: '1px solid #cfccc4',
    borderRadius: 6,
    fontSize: 13.5,
    fontWeight: 500,
    opacity: 1,
  },
  cards: { backgroundColor: 'transparent', opacity: 1 },
}

export const CONSOLE_LINES = [
  { time: '10:24:02', text: 'page loaded — 9 nodes, 1 stylesheet' },
  { time: '10:24:02', text: '[style] resolved 3 custom properties on :root' },
  { time: '10:24:11', level: 'warn' as const, text: 'h1 max-width 15ch clips at 375px' },
  { time: '10:24:19', text: '[select] h1 · 486 × 88' },
  { time: '10:24:26', level: 'error' as const, text: 'Uncaught TypeError: cta.on is not a function — app.js:7' },
]

export const DEVICES = [
  { id: 'sm', label: 'S' },
  { id: 'md', label: 'M' },
  { id: 'lg', label: 'L' },
  { id: 'full', label: 'Full' },
]
