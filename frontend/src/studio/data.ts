// Static demo data for the Style Studio shell — mirrors the mockup's
// hardcoded NODES/log content. Selection and editing are not wired up yet;
// this just gives the shell something real to render.

export interface StudioNode {
  id: string
  depth: number
  tag: string
  cls: string
  path: string
  box: string
}

export const NODES: StudioNode[] = [
  { id: 'bar', depth: 1, tag: 'header', cls: '.bar', path: 'body › header.bar', box: '860 × 53' },
  { id: 'logo', depth: 2, tag: 'span', cls: '.logo', path: 'header.bar › span.logo', box: '96 × 14' },
  { id: 'nav', depth: 2, tag: 'nav', cls: '', path: 'header.bar › nav', box: '186 × 18' },
  { id: 'h1', depth: 2, tag: 'h1', cls: '', path: 'main › h1', box: '486 × 86' },
  { id: 'lede', depth: 2, tag: 'p', cls: '.lede', path: 'main › p.lede', box: '452 × 51' },
  { id: 'row', depth: 2, tag: 'div', cls: '.row', path: 'main › div.row', box: '804 × 40' },
  { id: 'cta', depth: 3, tag: 'button', cls: '.cta', path: 'div.row › button.cta', box: '138 × 40' },
  { id: 'ghost', depth: 3, tag: 'button', cls: '.ghost', path: 'div.row › button.ghost', box: '126 × 40' },
  { id: 'cards', depth: 2, tag: 'div', cls: '.cards', path: 'main › div.cards', box: '804 × 132' },
]

export const SELECTED_NODE_ID = 'h1'

export interface InspectorField {
  label: string
  value: string
}

export interface InspectorSection {
  id: string
  label: string
  open: boolean
  fields: InspectorField[]
}

export const INSPECTOR_SECTIONS: InspectorSection[] = [
  {
    id: 'layout',
    label: 'Layout',
    open: true,
    fields: [
      { label: 'display', value: 'block' },
      { label: 'overflow', value: 'visible' },
    ],
  },
  {
    id: 'box',
    label: 'Box model',
    open: true,
    fields: [
      { label: 'width', value: '486px' },
      { label: 'height', value: '86px' },
      { label: 'margin', value: '0 0 14px' },
      { label: 'padding', value: '0px' },
    ],
  },
  {
    id: 'type',
    label: 'Typography',
    open: true,
    fields: [
      { label: 'family', value: 'Inter' },
      { label: 'size', value: '40px' },
      { label: 'weight', value: '500' },
      { label: 'leading', value: '1.08' },
      { label: 'tracking', value: '-0.022em' },
      { label: 'color', value: '#16181d' },
    ],
  },
  {
    id: 'fill',
    label: 'Fill & border',
    open: true,
    fields: [
      { label: 'fill', value: 'transparent' },
      { label: 'border', value: 'none' },
      { label: 'radius', value: '0px' },
    ],
  },
  {
    id: 'effects',
    label: 'Effects',
    open: false,
    fields: [
      { label: 'opacity', value: '1' },
      { label: 'shadow', value: 'none' },
      { label: 'filter', value: 'none' },
    ],
  },
  {
    id: 'position',
    label: 'Position',
    open: false,
    fields: [
      { label: 'position', value: 'static' },
      { label: 'z-index', value: 'auto' },
    ],
  },
  {
    id: 'motion',
    label: 'Transitions & animation',
    open: false,
    fields: [
      { label: 'property', value: 'none' },
      { label: 'duration', value: '0s' },
      { label: 'easing', value: 'ease' },
    ],
  },
]

export interface ConsoleLine {
  time: string
  level?: 'warn' | 'error'
  text: string
}

export const CONSOLE_LINES: ConsoleLine[] = [
  { time: '10:24:02', text: 'page loaded — 14 nodes, 1 stylesheet' },
  { time: '10:24:02', text: '[style] resolved 3 custom properties on :root' },
  { time: '10:24:11', level: 'warn', text: 'h1 max-width 15ch clips at 375px' },
  { time: '10:24:19', text: '[select] h1 · 486 × 88' },
  { time: '10:24:26', level: 'error', text: 'Uncaught TypeError: cta.on is not a function — app.js:7' },
]

export const DEVICES = [
  { id: 'sm', label: 'S' },
  { id: 'md', label: 'M' },
  { id: 'lg', label: 'L' },
  { id: 'full', label: 'Full' },
]
