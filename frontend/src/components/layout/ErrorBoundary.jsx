import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
          <AlertTriangle size={32} className="text-marigold-600" />
          <h1 className="mt-4 font-display text-2xl text-pine-700">Something went wrong</h1>
          <p className="mt-2 max-w-sm text-moss">
            We hit an unexpected error. Try refreshing the page — if it keeps happening, let us know.
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-6">
            Refresh page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
