import type { StudioNodeId } from './data'
import { getParsers, ancestorChainAt } from './treeSitter'
import { resolveNode, SELECTORS } from './selectors'

/** Parse `source` as HTML and resolve the node at `offset` using the
 * CSS-selector / structural-path / tree-walk layers in selectors.ts. */
export async function findNodeInHtml(source: string, offset: number): Promise<StudioNodeId | null> {
  const { html } = await getParsers()
  const tree = html.parse(source)
  if (!tree) return null
  const chain = ancestorChainAt(tree.rootNode, offset)
  return resolveNode(chain)
}

/** Reverse lookup: the text range of the tag name for a node's selector,
 * so external selection changes can move the editor cursor there. */
export async function findRangeForNode(
  source: string,
  id: StudioNodeId,
): Promise<{ start: number; end: number } | null> {
  const { html } = await getParsers()
  const tree = html.parse(source)
  if (!tree) return null

  const targetTag = SELECTORS[id].split(/\s+/).pop()!
  const targetClass = targetTag.match(/\.[\w-]+/)?.[0]?.slice(1) ?? null
  const targetTagName = targetTag.replace(/\.[\w-]+/g, '') || null

  let found: { start: number; end: number } | null = null
  function walk(node: import('./treeSitter').TSNode) {
    if (found) return
    if (node.type === 'element') {
      const chain = ancestorChainAt(node, node.startIndex + 1)
      const self = chain[chain.length - 1]
      if (self) {
        const classOk = !targetClass || self.classes.includes(targetClass)
        const tagOk = !targetTagName || self.tag === targetTagName
        if (classOk && tagOk && self.tagNameNode) {
          found = { start: self.tagNameNode.startIndex, end: self.tagNameNode.endIndex }
          return
        }
      }
    }
    for (const child of node.namedChildren) {
      if (child) walk(child)
      if (found) return
    }
  }
  walk(tree.rootNode)
  return found
}

/** Rule block (by selector) at `offset` in a CSS document. */
export async function findNodeInCss(source: string, offset: number): Promise<StudioNodeId | null> {
  const { css } = await getParsers()
  const tree = css.parse(source)
  if (!tree) return null

  let result: StudioNodeId | null = null
  function walk(node: import('./treeSitter').TSNode) {
    if (result) return
    if (node.type === 'rule_set' && offset >= node.startIndex && offset <= node.endIndex) {
      const selectors = node.namedChildren.find((c) => c && c.type === 'selectors')
      const text = selectors?.text.trim() ?? ''
      for (const [id, sel] of Object.entries(SELECTORS)) {
        const lastCompound = sel.split(/\s+/).pop()!
        // exact match first, then a loose "selector text contains this
        // compound's class" fallback for selectors we didn't author verbatim
        const cls = lastCompound.match(/\.[\w-]+/)?.[0]
        if (text === lastCompound || (cls && text.includes(cls))) {
          result = id as StudioNodeId
          return
        }
      }
      return
    }
    for (const child of node.namedChildren) {
      if (child) walk(child)
      if (result) return
    }
  }
  walk(tree.rootNode)
  return result
}

export const DEMO_HTML = `<header class="bar">
  <span class="logo">MERIDIAN</span>
  <nav>
    <a href="#work">Work</a>
    <a href="#studio">Studio</a>
    <a href="#contact">Contact</a>
  </nav>
</header>

<main>
  <h1>Design in the browser, not around it.</h1>
  <p class="lede">Select any element. Its box, type and color land in the
     inspector — edit them and the canvas follows.</p>
  <div class="row">
    <button class="cta">Start a project</button>
    <button class="ghost">See the work</button>
  </div>
  <div class="cards">
    <article class="card"><h3>Identity</h3><p>Marks, type systems, and the rules that hold them together.</p></article>
    <article class="card"><h3>Interface</h3><p>Product surfaces built to survive real content.</p></article>
    <article class="card"><h3>Motion</h3><p>Timing and easing as part of the brand, not decoration.</p></article>
  </div>
</main>
`
