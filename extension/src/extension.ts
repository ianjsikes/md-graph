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
import {
  id,
  getColumnSetting,
  getConfig,
  graphConfig,
  normalize,
} from './utils'

const watch = (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel,
  state: State,
  channel: vscode.OutputChannel
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
    let nodeId = id(normalize(event.path))
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

  vscode.window.onDidChangeActiveTextEditor(async (event) => {
    try {
      const p = normalize(event?.document.fileName || '')
      if (p === '.') return

      let nodeId = id(p)
      channel.appendLine(`OPENING FILE: ${p} --- ID: ${nodeId}`)
      if (state.graph[nodeId]) {
        state.currentNode = nodeId
        sendGraph()
      }
    } catch (error) {
      channel.appendLine(`ERROR OPENING FILE ${error.message}`)
    }
  })

  vscode.workspace.onDidOpenTextDocument(async (event) => {
    try {
      let p = normalize(event.uri.path.replace('.git', ''))
      let nodeId = id(p)
      if (state.graph[nodeId]) {
        state.currentNode = nodeId
        sendGraph()
      }
    } catch (error) {
      channel.appendLine(`ERROR OPENING DOCUMENT ${error.message}`)
    }
  })

  vscode.workspace.onDidRenameFiles(async (event) => {
    for (const file of event.files) {
      const prev = normalize(file.oldUri.path)
      const next = normalize(file.newUri.path)
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
    async (message) => {
      if (message.type === 'ready') {
        sendGraph()
      }
      if (message.type === 'click') {
        try {
          const openPath = vscode.Uri.file(message.payload.path)
          const column = getColumnSetting('openColumn')

          const doc = await vscode.workspace.openTextDocument(openPath)
          await vscode.window.showTextDocument(doc, column)
          state.currentNode = message.payload.id
          sendGraph()
        } catch (err) {
          vscode.window.showErrorMessage(
            `Unable to open "${message.payload.path}" - ${err.message}`
          )
        }
      }
      if (message.type === 'mode') {
        state.mode = message.payload
        sendGraph()
      }
      if (message.type === 'error') {
        vscode.window.showErrorMessage(message.payload)
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
  const channel = vscode.window.createOutputChannel('md-graph')
  context.subscriptions.push(channel)

  context.subscriptions.push(
    vscode.commands.registerCommand('md-graph.showGraph', async () => {
      const currentFilePath = normalize(
        vscode.window.activeTextEditor?.document?.uri?.path || ''
      )
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
      watch(context, panel, state, channel)
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
