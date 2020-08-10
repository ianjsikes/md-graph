import React from 'react'
import Graph from './Graph'
import './style.css'
import ErrorAlert from './ErrorAlert'

const App: React.FC<{}> = () => {
  React.useEffect(() => {
    console.log('VS CODE', vscode, window)
    vscode.postMessage({ type: 'ready' })
  }, [])

  return (
    <ErrorAlert>
      <Graph />
    </ErrorAlert>
  )
}
App.displayName = 'App'

export default App
