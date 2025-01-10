// eslint-disable-next-line no-restricted-imports
import React, { PureComponent, PropsWithChildren } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { unwrap } from './unwrap'

export function createErrorBoundary<P>(
  Component: React.ComponentType<PropsWithChildren<{ error: Error | null }>>,
) {
  type State = { error: Error | null }

  class WithErrorBoundary extends PureComponent<P, State> {
    state: State = { error: null }

    componentDidCatch(error: Error) {
      this.setState({ error })
    }

    render() {
      const { error } = this.state
      const { children } = this.props

      return <Component error={unwrap(error)}>{children}</Component>
    }
  }

  return hoistNonReactStatics(WithErrorBoundary, Component)
}
