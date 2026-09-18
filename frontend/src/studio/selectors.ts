import type { StudioNodeId } from './data'
import type { AstElement } from './treeSitter'

// Descendant-combinator CSS selectors for each known node — the ground
// truth "layer 1" matcher walks against these directly.
export const SELECTORS: Record<StudioNodeId, string> = {
  bar: 'header.bar',
  logo: 'header.bar span.logo',
  nav: 'header.bar nav',
  h1: 'main h1',
  lede: 'p.lede',
  row: 'div.row',
  cta: 'div.row button.cta',
  ghost: 'div.row button.ghost',
  cards: 'div.cards',
}

interface Compound {
  tag: string | null
  classes: string[]
}

function parseSelector(selector: string): Compound[] {
  return selector
    .trim()
    .split(/\s+/)
    .map((part) => {
      const classes = part.match(/\.[\w-]+/g)?.map((c) => c.slice(1)) ?? []
      const tag = part.replace(/\.[\w-]+/g, '') || null
      return { tag, classes }
    })
}

const PARSED_SELECTORS: [StudioNodeId, Compound[]][] = Object.entries(SELECTORS).map(([id, sel]) => [
  id as StudioNodeId,
  parseSelector(sel),
])

function compoundMatches(compound: Compound, el: AstElement): boolean {
  if (compound.tag && compound.tag !== el.tag) return false
  return compound.classes.every((c) => el.classes.includes(c))
}

/** Does the full descendant-combinator selector match this ancestor chain,
 * with `compounds[last]` required to match the chain's own last element? */
function chainMatches(chain: AstElement[], compounds: Compound[]): boolean {
  if (compounds.length === 0) return false
  const last = chain[chain.length - 1]
  if (!compoundMatches(compounds[compounds.length - 1], last)) return false

  // Walk the remaining compounds backward, requiring each to match *some*
  // earlier ancestor in order (classic CSS descendant-selector semantics).
  let chainIdx = chain.length - 2
  for (let ci = compounds.length - 2; ci >= 0; ci--) {
    let found = false
    while (chainIdx >= 0) {
      if (compoundMatches(compounds[ci], chain[chainIdx])) {
        found = true
        chainIdx--
        break
      }
      chainIdx--
    }
    if (!found) return false
  }
  return true
}

/**
 * Three layers of searching, from most to least precise:
 *  1. CSS selector — the innermost element matches a known selector's own
 *     tag/class directly.
 *  2. XPath-ish structural path — the full ancestor chain satisfies a
 *     known selector's descendant combinators (position in the tree, not
 *     just the node itself).
 *  3. Tree walking — no known selector matches at all; fall back to the
 *     nearest ancestor (or self) that has *any* tag/class we recognize.
 */
export function resolveNode(chain: AstElement[]): StudioNodeId | null {
  if (chain.length === 0) return null
  const self = chain[chain.length - 1]

  // Layer 1: direct selector match on the node itself.
  for (const [id, compounds] of PARSED_SELECTORS) {
    if (compoundMatches(compounds[compounds.length - 1], self)) return id
  }

  // Layer 2: full structural (descendant-path) match.
  for (const [id, compounds] of PARSED_SELECTORS) {
    if (compounds.length > 1 && chainMatches(chain, compounds)) return id
  }

  // Layer 3: walk up the tree for the nearest recognizable ancestor.
  for (let i = chain.length - 1; i >= 0; i--) {
    const el = chain[i]
    for (const [id, compounds] of PARSED_SELECTORS) {
      const last = compounds[compounds.length - 1]
      if ((last.tag && last.tag === el.tag) || last.classes.some((c) => el.classes.includes(c))) {
        return id
      }
    }
  }

  return null
}
