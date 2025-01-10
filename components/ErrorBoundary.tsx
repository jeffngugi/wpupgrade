import React, { Component } from 'react'
import { Alert, View } from 'react-native'
import * as Sentry from '@sentry/react-native'

class ErrorBoundary extends Component<{ children?: React.ReactNode }> {
  state = {
    error: false,
    message: null,
    details: null,
  }

  componentDidCatch = (error: any, info: any) => {
    this.setState({ error: true, message: error, details: info })

    Alert.alert('Oops!', 'An error occured')

    Sentry.captureException(error)
  }

  render() {
    return this.state.error ? <View /> : this.props.children
  }
}

export default ErrorBoundary
