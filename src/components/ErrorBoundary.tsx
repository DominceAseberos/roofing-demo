import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="checkout-fallback">
          <span className="mono-label">Payment surface / paused</span>
          <p>
            The checkout element could not mount. Your card has not been charged. Please
            refresh the page or call the office.
          </p>
          <p className="checkout-fallback__detail">{this.state.error?.message}</p>
          <button
            className="text-link"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            <span>Try again</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
