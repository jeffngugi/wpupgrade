// eslint-disable-next-line no-restricted-imports
import React, { Suspense, PureComponent, ComponentProps } from 'react'
import { memoize } from 'lodash'
import { SuspenseCompatActualError } from './SuspenseCompatActualError'
import { SuspenseCompatPromiseError } from './SuspenseCompatPromiseError'

type State = { error: Error | null; isLoading: boolean }

type Retry = () => void

export type ErrorBoundaryProps = {
  error: Error
  retry?: Retry
}

export type SuspenseCompatBoundaryProps = React.PropsWithChildren<{
  errorBoundaryComponent: React.ComponentType<ErrorBoundaryProps>
  fallback: ComponentProps<typeof Suspense>['fallback']
  retry?: Retry
}>

/** @internal */
class BaseSuspenseCompatBoundary extends PureComponent<
  SuspenseCompatBoundaryProps,
  State
> {
  state: State = { error: null, isLoading: false }
  _isMounted = true

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidCatch(error: Error) {
    if (error instanceof SuspenseCompatPromiseError) {
      ;(async () => {
        try {
          this.setState({ isLoading: true, error: null }, async () => {
            await error.promise.catch(() => {})
            if (!this._isMounted) {
              return
            }
            if (error.error) {
              this.setState({ error: error.error, isLoading: false })
            } else {
              this.setState({ isLoading: false, error: null })
            }
          })
        } catch (error) {
          if (!this._isMounted) {
            return
          }
          this.setState({ error, isLoading: false })
        }
      })()
    } else {
      this.setState({ error, isLoading: false })
    }
  }

  createRetry = memoize((retry?: Retry) => {
    if (!retry) {
      return undefined
    }

    return () => {
      this.setState({ error: null, isLoading: false })
      retry()
    }
  })

  render() {
    const {
      children,
      fallback: pendingFallback,
      errorBoundaryComponent: ErrorBoundaryContent,
    } = this.props
    const { error, isLoading } = this.state

    const retry =
      error instanceof SuspenseCompatActualError ? error.retry : undefined

    const normalizedError =
      error instanceof SuspenseCompatActualError ? error.error : error

    if (normalizedError) {
      return (
        <ErrorBoundaryContent
          retry={this.createRetry(retry)}
          error={normalizedError}
        />
      )
    }

    if (isLoading) {
      return pendingFallback
    }

    return children
  }
}

export function SuspenseCompatBoundary({
  children,
  ...props
}: SuspenseCompatBoundaryProps) {
  return (
    <Suspense fallback={props.fallback}>
      <BaseSuspenseCompatBoundary {...props}>
        {children}
      </BaseSuspenseCompatBoundary>
    </Suspense>
  )
}
