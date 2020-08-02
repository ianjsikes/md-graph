// TODO: Figure out a way to share these types between extension and webview

export interface Node {
  id: string
  path: string
  label: string
  links: string[]
  backlinks: string[]
}

export type Graph = Record<string, Node>

export interface State {
  graph: Graph
  currentNode?: string
}

export interface Edge {
  source: string
  target: string
}
