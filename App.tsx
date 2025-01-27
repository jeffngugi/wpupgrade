import React, { useCallback, useEffect, useRef } from 'react'
import { NativeBaseProvider } from 'native-base'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as Sentry from '@sentry/react-native'
// import CodePush from 'react-native-code-push'
import { LinearGradient } from 'expo-linear-gradient'
import { AnalyticsProvider } from '@segment/analytics-react-native'

import useCachedResources from './hooks/useCachedResources'

import { customTheme } from './theme'
import store from './store'
import Provider from './Provider'
import { createCacheStoreGetter } from './storage/cache'
import ClientApp from '~ClientApp'
import ErrorBoundary from '~ErrorBoundary'
import SplashScreen from 'react-native-splash-screen'
import { productAnalytics } from '~utils/analytics'
// import { useAppInactivity } from '~utils/hooks/useAppInactivity'

// or ES6+ destructured imports

// const OTAUpdateOptions = {
//   checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
//   mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
// }

// Sentry.init({
//   dsn: 'https://1ed5e9345a9546f38a3050bffee72c82@o153585.ingest.sentry.io/5729412',
//   debug: process.env.NODE_ENV === 'development',
//   environment: process.env.NODE_ENV,
//   enabled: false,
// })

function App() {
  const isLoadingComplete = useCachedResources()
  const config = {
    dependencies: {
      'linear-gradient': LinearGradient,
    },
  }
  const cacheStore = createCacheStoreGetter()

  useEffect(() => {
    if (isLoadingComplete) {
      SplashScreen.hide()
    }
  }, [isLoadingComplete])

  // const { _panResponder } = useAppInactivity()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <AnalyticsProvider client={productAnalytics}>
          <Provider store={store} cacheStore={cacheStore}>
            <NativeBaseProvider theme={customTheme} config={config}>
              <ErrorBoundary>
                <ClientApp />
              </ErrorBoundary>
            </NativeBaseProvider>
          </Provider>
        </AnalyticsProvider>
      </SafeAreaProvider>
    )
  }
}
export default App
