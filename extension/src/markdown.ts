import * as vscode from 'vscode'
import { MarkdownNode } from './types'

/**
 * Recursively traverse all nodes in a Remark tree. Returns a list of links
 */
export const findLinks = (ast: MarkdownNode): string[] => {
  if (ast.type === 'link' || ast.type === 'definition') {
    if (
      !ast.url ||
      ast.url.startsWith('#') ||
      vscode.Uri.parse(ast.url).scheme.startsWith('http')
    ) {
      // Base case: Link is not valid
      return []
    }
    // Base case: Link is valid
    return [ast.url]
  }

  if (ast.type === 'wikiLink') {
    // Base case: Link is a valid wikilink. Provided by remark-wiki-link
    return [ast.data!.permalink!]
  }

  // Base case: Reached a leaf node that isn't text
  if (!ast.children) return []

  // Recursive step: find links in all child nodes
  let links = ast.children.reduce(
    (links, node) => [...findLinks(node), ...links],
    [] as string[]
  )

  return links
}

export const findTitle = (ast: MarkdownNode): string | null => {
  if (!ast.children) return null

  for (const child of ast.children) {
    if (
      child.type === 'heading' &&
      child.depth === 1 &&
      child.children &&
      child.children.length > 0
    ) {
      return child.children[0].value!
    }
  }
  return null
}
