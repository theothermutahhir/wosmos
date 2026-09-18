import Parser from 'web-tree-sitter'
import treeSitterWasm from 'web-tree-sitter/tree-sitter.wasm?url'
import htmlWasm from 'tree-sitter-wasms/out/tree-sitter-html.wasm?url'
import cssWasm from 'tree-sitter-wasms/out/tree-sitter-css.wasm?url'

export type TSNode = Parser.SyntaxNode

let initPromise: Promise<{ html: Parser; css: Parser }> | null = null

async function init() {
  await Parser.init({ locateFile: () => treeSitterWasm })

  const htmlLang = await Parser.Language.load(htmlWasm)
  const htmlParser = new Parser()
  htmlParser.setLanguage(htmlLang)

  const cssLang = await Parser.Language.load(cssWasm)
  const cssParser = new Parser()
  cssParser.setLanguage(cssLang)

  return { html: htmlParser, css: cssParser }
}

/** Lazily-initialized, memoized parser pair (HTML + CSS grammars). */
export function getParsers() {
  if (!initPromise) initPromise = init()
  return initPromise
}

/** Element ancestor chain from the document root down to (and including)
 * the node at `offset` — the raw material the selector/xpath/tree-walk
 * layers in selectors.ts resolve against. */
export interface AstElement {
  tag: string
  classes: string[]
  node: TSNode
  tagNameNode: TSNode | null
}

export function ancestorChainAt(root: TSNode, offset: number): AstElement[] {
  const chain: AstElement[] = []
  let current: TSNode | null = root.descendantForIndex(offset)

  while (current) {
    if (current.type === 'element') {
      const startTag = current.namedChildren.find(
        (c) => c && (c.type === 'start_tag' || c.type === 'self_closing_tag'),
      )
      const tagNameNode = startTag?.namedChildren.find((c) => c && c.type === 'tag_name') ?? null
      const tag = tagNameNode?.text.toLowerCase() ?? ''

      const classes: string[] = []
      const attrs = startTag?.namedChildren.filter((c) => c && c.type === 'attribute') ?? []
      for (const attr of attrs) {
        const nameNode = attr?.namedChildren.find((c) => c && c.type === 'attribute_name')
        if (nameNode?.text === 'class') {
          const valueNode = attr?.namedChildren.find((c) => c && c.type === 'quoted_attribute_value')
          const raw = valueNode?.text.replace(/^["']|["']$/g, '') ?? ''
          classes.push(...raw.split(/\s+/).filter(Boolean))
        }
      }

      chain.unshift({ tag, classes, node: current, tagNameNode })
    }
    current = current.parent
  }

  return chain
}
