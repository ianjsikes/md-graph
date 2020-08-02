import * as vscode from 'vscode'
import { MarkdownNode, Graph, Node } from './types'

export const filterNonExistentEdges = (graph: Graph) => {
  for (const nodeId in graph) {
    const node = graph[nodeId]
    node.links = node.links.filter((link) => link in graph)
  }
}

const addUnique = <T>(arr: T[], item: T): T[] =>
  Array.from(new Set(arr).add(item))

export const generateBacklinks = (graph: Graph) => {
  for (const nodeId in graph) {
    const node = graph[nodeId]
    for (const link of node.links) {
      const linkedNode = graph[link]
      linkedNode.backlinks = addUnique(linkedNode.backlinks, nodeId)
    }
  }
}
