import React from 'react'
import { MutationCache, QueryCache } from '@tanstack/react-query'
import { Toast } from 'native-base'
import ErrorAlert from '~components/ErrorAlert'
import AxiosErrorAlert from '~components/AxiosErrorAlert'

const mutationCache = new MutationCache({
  onError: (error: any, _variables, _context, mutation) => {
    const description =
      error.response?.data?.message ??
      'Something went wrong, please try again later'
    //Show server error toast
    if (error?.response?.status > 500) {
      Toast.show({
        render: () => {
          return (
            <ErrorAlert
              description="Please try again or reach out to our support team at hello@workpay.co.ke"
              error="error"
            />
          )
        },
        placement: 'top',
        top: 100,
        duration: 3000,
      })
      setTimeout(() => Toast.closeAll(), 3000)
      return
    }

    if (mutation.options.onError) return
    Toast.show({
      render: () => {
        return <AxiosErrorAlert error={error} />
      },
      placement: 'top',
      top: 100,
      duration: 3000,
    })
    setTimeout(() => Toast.closeAll(), 3000)
  },
})

const queryCache = new QueryCache({
  onError: (error, query) => {
    //Sample to show how we can track error Query key

    const url = error.config.url as string
    url.includes('wallet-api/user/')

    if (url.includes('wallet-api/user/')) return

    const description =
      error.response?.data?.message ??
      'Something went wrong, please try again later'
    Toast.show({
      render: () => {
        return <ErrorAlert description={description} />
      },
      placement: 'top',
      top: 100,
      duration: 3000,
    })
    setTimeout(() => Toast.closeAll(), 3000) //A small workaround to avoid duplicate toasts
  },
})

export { mutationCache, queryCache }
