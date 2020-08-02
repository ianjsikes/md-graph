import React from 'react'
import { useVsCodeEventListener } from './vscode'

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

const useGraphState = () => {
  const [state, setState] = React.useState<State>({
    graph: {},
    currentNode: undefined,
  })
  useVsCodeEventListener((message) => {
    if (message.type === 'update') {
      setState(message.payload)
    }
  }, [])
  return state
}

export default () => {
  const state = useGraphState()
  React.useEffect(() => {
    console.log('VS CODE', vscode, window)
    vscode.postMessage({ type: 'ready' })
  }, [])

  return (
    <div>
      <h1>Hello</h1>
      <p>{JSON.stringify(state, null, 2)}</p>
    </div>
  )
}
