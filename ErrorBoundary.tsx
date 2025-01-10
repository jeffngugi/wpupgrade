import React, { ErrorInfo, ReactNode } from 'react'
import ErrorFallbackUi from '~components/ErrorFallbackUi'
// import * as Sentry from '@sentry/react-native'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    // Sentry.captureException(error)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackUi />
    } else {
      return this.props.children
    }
  }
}

export default ErrorBoundary
