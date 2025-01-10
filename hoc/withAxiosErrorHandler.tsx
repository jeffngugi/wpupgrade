import React, { Component } from 'react'
import * as Sentry from '@sentry/react-native'
import propTypes from 'prop-types'
import { AxiosStatic } from 'axios'

type AlertLevel = 'info' | 'warning' | 'danger'

interface ErrorHandlerProps {
  loading: boolean
  onLoading: () => void
  onLoaded: () => void
}

const withAxiosErrorHandler = (
  WrappedComponent: React.FunctionComponent<ErrorHandlerProps>,
  axios: AxiosStatic,
) => {
  return class extends Component<ErrorHandlerProps> {
    state = {
      error: null,
      type: null,
    }

    UNSAFE_componentWillMount() {
      this.requestInterceptor = axios.interceptors.request.use(request => {
        // Right place to toggle a preloader
        if (request.method !== 'get') {
          this.props.onLoading()
        }
        return request
      })

      this.responseInterceptor = axios.interceptors.response.use(
        response => {
          if (response) {
            // Right place to toggle preloader
            if (this.props.loading) {
              this.props.onLoaded()
            }
            return response
          }
        },
        error => {
          let message: string
          let type: AlertLevel

          if (error.response) {
            message = error.response.data.message
            type = 'info'
          } else if (error.request) {
            message = 'A request made to the server did not succeed'
            type = 'warning'
          } else {
            message = 'An application error occured'
            type = 'danger'
          }

          this.setState({ error: message, type: type })
          Sentry.captureException(error)
        },
      )
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.requestInterceptor)
      axios.interceptors.response.eject(this.responseInterceptor)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

withAxiosErrorHandler.propTypes = {
  loading: propTypes.bool,
  onLoading: propTypes.func,
  onLoaded: propTypes.func,
}

export default withAxiosErrorHandler
