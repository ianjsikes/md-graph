import * as vscode from 'vscode'
import * as path from 'path'
import * as remark from 'remark'
import * as wikiLinkPlugin from 'remark-wiki-link'
import * as frontmatter from 'remark-frontmatter'
import { MarkdownNode, State } from './types'
import { TextDecoder } from 'util'
import { id, getConfig } from './utils'
import { findLinks, findTitle } from './markdown'

const parser = remark().use(wikiLinkPlugin).use(frontmatter)

export const fileGlob = () => {
  const fileTypes = getConfig('fileTypes', ['md'])
  return `**/*.{${fileTypes.join(',')}}`
}

export const parseFile = async (state: State, filePath: string) => {
  console.log('attempting to parse file', filePath)
  filePath = path.normalize(filePath)
  console.log('normalized:', filePath)
  vscode.window.showErrorMessage(`parsing ${filePath}`)
  const buffer = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath))
  const content = new TextDecoder('utf-8').decode(buffer)
  console.log('content', content)
  const ast: MarkdownNode = parser.parse(content)

  let title = findTitle(ast)
  let nodeId = id(filePath)
  let node = state.graph[nodeId]

  if (!title) {
    if (node) {
      delete state.graph[nodeId]
    }
    return
  }

  if (node) {
    node.label = title
  } else {
    node = {
      id: id(filePath),
      path: filePath,
      label: title,
      links: [],
      backlinks: [],
      level: 10000000,
    }
    state.graph[nodeId] = node
  }

  const links = findLinks(ast)
  const parentDirectory = filePath.split(path.sep).slice(0, -1).join(path.sep)
  let linkSet = new Set<string>()

  for (const link of links) {
    let target = path.normalize(link)
    if (!path.isAbsolute(link)) {
      target = path.normalize(`${parentDirectory}/${link}`)
    }
    linkSet.add(id(target))
  }
  node.links = Array.from(linkSet)
  console.log('done parsing', filePath)
}

export const forEachFile = async (
  state: State,
  callback: (state: State, path: string) => Promise<void>
) => {
  const files = await vscode.workspace.findFiles(fileGlob())
  vscode.window.showErrorMessage(JSON.stringify(files, null, 2))

  return Promise.all(
    files.map((file) => {
      const isHiddenFile = path.basename(file.path).startsWith('.')
      if (!isHiddenFile) {
        return callback(state, file.path)
      }
    })
  )
}
