import React from 'react'

interface Props {}
interface State {
  error: {
    message: string
    stack?: string
    componentStack?: string
  } | null
}
export default class ErrorAlert extends React.Component<Props, State> {
  constructor(props: {}) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error: {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
      },
    })
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <h1>Something went wrong!</h1>
          <h3 style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.message}</h3>
          <hr />
          <p>
            Please include the info shown here when{' '}
            <a href="https://github.com/ianjsikes/md-graph/issues">
              filing an issue
            </a>{' '}
            on GitHub
          </p>
          <hr />
          <h3>React Component Stack:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error.componentStack}
          </p>
          <hr />
          <h3>Error Stack:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.stack}</p>
        </div>
      )
    }
    return this.props.children
  }
}
