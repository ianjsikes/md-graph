import * as vscode from 'vscode'
import * as md5 from 'md5'
import { extname } from 'path'
import { MdGraphConfig, ColumnType, Mode } from './types'

export const graphConfig = () => {
  const cfg = vscode.workspace.getConfiguration('md-graph.graph')
  return {
    defaultMode: cfg.get('defaultMode') as Mode,
    focusNeighborDepth: cfg.get('focusNeighborDepth') as number,
    fadeDepth: cfg.get('fadeDepth') as number,
  }
}

/**
 * Get VS Code extension configuration values
 */
export const getConfig = <K extends keyof MdGraphConfig>(
  key: K,
  defaultVal: MdGraphConfig[K]
) =>
  vscode.workspace.getConfiguration('md-graph').get<MdGraphConfig[K]>(key) ||
  defaultVal

export const id = (path: string): string => {
  return md5(path.slice(0, path.length - extname(path).length))
}

const columnSettingToValue: { [key in ColumnType]: number } = {
  beside: -2,
  active: -1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
}
export const getColumnSetting = (key: 'showColumn' | 'openColumn') => {
  const column = getConfig(key, 'one')
  return columnSettingToValue[column]
}
