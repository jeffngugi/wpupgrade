import React, {useMemo} from 'react';
import {useWindowDimensions, Text} from 'react-native';
import {Provider as ReduxProvider} from 'react-redux';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {IntlProvider} from 'react-intl';
import {useNegotiatedLocale} from './locale/useNegotiatedLocale';
import {PlatformActivityIndicator} from './components/PlatformActivityIndicator';
import {Context as ResponsiveContext} from 'react-responsive';
import {CacheInstanceProvider} from './storage/cache';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SuspenseCompat} from './SuspenseCompat';
import {renderNonLocalizableErrorBoundary} from './renderErrorBoundary';

export default function Provider({store, children, cacheStore}) {
  return (
    <CacheInstanceProvider cacheStore={cacheStore} currentUserId={null}>
      <ReduxProvider store={store}>
        <SuspenseCompat
          fallback={<PlatformActivityIndicator />}
          errorBoundaryComponent={renderNonLocalizableErrorBoundary}>
          <LocalizedApp>
            <ActionSheetProvider>{children}</ActionSheetProvider>
          </LocalizedApp>
        </SuspenseCompat>
      </ReduxProvider>
    </CacheInstanceProvider>
  );
}

function LocalizedApp({children}) {
  const {locale, messages} = useNegotiatedLocale();
  const {height, width} = useWindowDimensions();
  const responsiveContext = useMemo(() => ({height, width}), [height, width]);

  return (
    <SafeAreaProvider>
      <ResponsiveContext.Provider value={responsiveContext}>
        <IntlProvider locale={locale} messages={messages} textComponent={Text}>
          <SuspenseCompat>{children}</SuspenseCompat>
        </IntlProvider>
      </ResponsiveContext.Provider>
    </SafeAreaProvider>
  );
}
