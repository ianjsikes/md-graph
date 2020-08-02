import React from 'react'
import { State } from './types'

type VsCodeEventListener = (message: { type: string; payload: any }) => void
export const useVsCodeEventListener = (
  callback: VsCodeEventListener,
  deps?: React.DependencyList
) => {
  React.useEffect(() => {
    const listener = ({ data }: MessageEvent) => callback(data)
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, deps)
}

export const useGraphState = () => {
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
