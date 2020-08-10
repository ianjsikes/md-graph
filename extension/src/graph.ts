import { Graph, State } from './types'

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

/**
 * Performs a breadth-first traversal of the graph, starting at currentNode.
 * Adds a `level` property to each node indicating its distance from the start.
 */
export const traverseGraph = ({ graph, currentNode }: State) => {
  for (const nodeId in graph) {
    const node = graph[nodeId]
    node.level = 10000000
  }

  if (!currentNode || !graph[currentNode]) {
    return
  }

  let visitedSet = new Set()
  let queue = [graph[currentNode]]
  queue[0].level = 0
  let level = 1
  // The 1 here could be changed to show more nodes
  while (queue.length) {
    let queueLength = queue.length
    for (let i = 0; i < queueLength; i++) {
      let head = queue.shift()!
      visitedSet.add(head.id)

      let allLinks = [...head.links, ...head.backlinks]
      for (const l of allLinks) {
        if (graph[l] && graph[l].level > level) {
          graph[l].level = level
          queue.push(graph[l])
        }
      }
    }
    level += 1
  }
}
