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
}

export type Graph = Record<string, Node>

export interface State {
  graph: Graph
  currentNode?: string
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
