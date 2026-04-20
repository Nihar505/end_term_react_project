import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          <h2 className="mb-2 text-lg font-semibold">Something went wrong.</h2>
          <p className="mb-4 text-sm opacity-90">{this.state.error.message}</p>
          <button
            onClick={this.handleReset}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
