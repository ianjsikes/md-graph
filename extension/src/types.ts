export type ColumnType =
  | 'active'
  | 'beside'
  | 'one'
  | 'two'
  | 'three'
  | 'four'
  | 'five'
  | 'six'
  | 'seven'
  | 'eight'
  | 'nine'
export interface MdGraphConfig {
  showColumn: ColumnType
  openColumn: ColumnType
  autoStart: boolean
  fileTypes: string[]
}

export interface Node {
  /**
   * Some unique identifier. Currently this is just the absolute file path minus the extension
   */
  id: string
  path: string
  /**
   * The first header found in the file. Falls back to the file name if no header is found.
   */
  label: string
  links: string[]
  /**
   * Since the data represents a directed graph, but the visualized graph is undirected,
   * it helps to have the backlinks as well.
   */
  backlinks: string[]
  /**
   * The distance from this node to the currently selected node.
   * Computed from a breadth-first graph traversal starting at currentNode.
   * This will change as you open/close files.
   */
  level: number
}

export type Graph = Record<string, Node>

export type Mode = 'ALL' | 'FOCUS'

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

export interface MarkdownNode {
  type: string
  children?: MarkdownNode[]
  url?: string
  value?: string
  depth?: number
  data?: {
    permalink?: string
  }
}
