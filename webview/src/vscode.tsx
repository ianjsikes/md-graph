import React from 'react'

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
