// TODO: Figure out a way to share these types between extension and webview

export interface Node {
  id: string
  path: string
  label: string
  links: string[]
  backlinks: string[]
  level: number
}

export type Mode = 'ALL' | 'FOCUS'

export type Graph = Record<string, Node>

export interface GraphConfig {
  defaultMode: Mode
  focusNeighborDepth: number
  fadeDepth: number
}

export interface State {
  graph: Graph
  currentNode?: string
  mode: Mode
  config: GraphConfig
}

export interface Edge {
  source: string
  target: string
}

export type D3Node = Node & d3.SimulationNodeDatum
