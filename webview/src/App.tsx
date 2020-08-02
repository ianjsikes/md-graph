import React from 'react'
import Graph from './Graph'
import './style.css'

const App = () => {
  React.useEffect(() => {
    console.log('VS CODE', vscode, window)
    vscode.postMessage({ type: 'ready' })
  }, [])

  return <Graph />
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Graph />
    </div>
  )
}

export default App
