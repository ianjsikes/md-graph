import * as vscode from 'vscode'
import * as path from 'path'
import { TextDecoder } from 'util'
import { State } from './types'
import { fileGlob, parseFile, forEachFile } from './files'
import {
  filterNonExistentEdges,
  generateBacklinks,
  traverseGraph,
} from './graph'
import { id, getColumnSetting, getConfig, graphConfig } from './utils'

const watch = (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel,
  state: State
) => {
  if (vscode.workspace.rootPath === undefined) {
    return
  }

  const watcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(vscode.workspace.rootPath, fileGlob()),
    false,
    false,
    false
  )

  const sendGraph = () => {
    filterNonExistentEdges(state.graph)
    generateBacklinks(state.graph)
    traverseGraph(state)
    panel.webview.postMessage({ type: 'update', payload: state })
  }

  watcher.onDidChange(async (event) => {
    await parseFile(state, event.path)
    sendGraph()
  })

  watcher.onDidCreate(async (event) => {
    await parseFile(state, event.path)
    sendGraph()
  })

  watcher.onDidDelete(async (event) => {
    let nodeId = id(event.path)
    let node = state.graph[nodeId]
    if (!node) return

    delete state.graph[nodeId]
    for (const nid in state.graph) {
      const n = state.graph[nid]
      n.links = n.links.filter((link) => link !== nodeId)
    }

    sendGraph()
  })

  vscode.workspace.onDidChangeConfiguration(async (event) => {
    if (event.affectsConfiguration('md-graph.graph')) {
      state.config = graphConfig()
      sendGraph()
    }
  })

  vscode.workspace.onDidOpenTextDocument(async (event) => {
    let path = event.uri.path.replace('.git', '')
    let nodeId = id(path)
    state.currentNode = nodeId
    sendGraph()
  })

  vscode.workspace.onDidRenameFiles(async (event) => {
    for (const file of event.files) {
      const prev = file.oldUri.path
      const next = file.newUri.path
      const prevId = id(prev)
      const nextId = id(next)

      if (state.graph[prevId]) {
        state.graph[nextId] = state.graph[prevId]
        state.graph[nextId].path = next
        delete state.graph[prevId]
      }

      for (const nodeId in state.graph) {
        const node = state.graph[nodeId]
        node.links = node.links.map((link) => (link === prevId ? nextId : link))
      }
    }

    sendGraph()
  })

  panel.webview.onDidReceiveMessage(
    (message) => {
      if (message.type === 'ready') {
        sendGraph()
      }
      if (message.type === 'click') {
        const openPath = vscode.Uri.file(message.payload.path)
        const column = getColumnSetting('openColumn')

        vscode.workspace.openTextDocument(openPath).then((doc) => {
          vscode.window.showTextDocument(doc, column)
        })
      }
      if (message.type === 'mode') {
        state.mode = message.payload
        sendGraph()
      }
    },
    undefined,
    context.subscriptions
  )

  panel.onDidDispose(() => {
    watcher.dispose()
  })
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('md-graph.showGraph', async () => {
      const currentFilePath =
        vscode.window.activeTextEditor?.document?.uri?.path
      const column = getColumnSetting('showColumn')
      const panel = vscode.window.createWebviewPanel(
        'md-graph',
        'md-graph',
        column,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      )

      if (vscode.workspace.rootPath === undefined) {
        vscode.window.showErrorMessage(
          'This command can only be activated in an open directory'
        )
        return
      }

      const state: State = {
        graph: {},
        currentNode: undefined,
        mode: 'ALL',
        config: graphConfig(),
      }
      state.mode = state.config.defaultMode

      await forEachFile(state, parseFile)
      filterNonExistentEdges(state.graph)
      generateBacklinks(state.graph)
      traverseGraph(state)

      if (currentFilePath && state.graph[id(currentFilePath)]) {
        state.currentNode = id(currentFilePath)
      }

      panel.webview.html = await getWebviewContent(context, panel)
      watch(context, panel, state)
    })
  )

  const shouldAutoStart = getConfig('autoStart', false)
  if (shouldAutoStart) {
    vscode.commands.executeCommand('md-graph.showGraph')
  }
}

async function getWebviewContent(
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel
) {
  const webviewPath = vscode.Uri.file(
    path.resolve(context.extensionPath, 'webview', 'static', 'index.html')
  )
  const file = await vscode.workspace.fs.readFile(webviewPath)
  const text = new TextDecoder('utf-8').decode(file)

  return text.replace(
    '{{bundle.js}}',
    panel.webview
      .asWebviewUri(
        vscode.Uri.file(
          path.resolve(context.extensionPath, 'webview', 'out', 'bundle.js')
        )
      )
      .toString()
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
