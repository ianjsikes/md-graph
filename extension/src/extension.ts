// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as path from 'path'

import { hash } from './blah'
import { TextDecoder } from 'util'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('md-graph.showGraph', async () => {
      const currentFilePath =
        vscode.window.activeTextEditor?.document?.uri?.path
      const panel = vscode.window.createWebviewPanel(
        'md-graph',
        'md-graph',
        -2,
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

      panel.webview.html = await getWebviewContent(context, panel)
    })
  )
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
