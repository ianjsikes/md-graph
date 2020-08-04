import React from 'react'
import Graph from './Graph'
import './style.css'

const App = () => {
  React.useEffect(() => {
    console.log('VS CODE', vscode, window)
    vscode.postMessage({ type: 'ready' })
  }, [])

  return <Graph />
}

export default App
