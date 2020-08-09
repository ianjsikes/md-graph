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
  id: string
  path: string
  label: string
  links: string[]
  backlinks: string[]
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
