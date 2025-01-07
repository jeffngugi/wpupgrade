import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Config from 'react-native-config';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://1ed5e9345a9546f38a3050bffee72c82@o153585.ingest.us.sentry.io/5729412',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

const App = () => {
  console.log('The config is', Config);
  return (
    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
      <Text>Test react native config for ansdsdsdroid</Text>
      <Text> Installed expo local authentication</Text>
      <Button
        title="Try!"
        onPress={() => {
          Sentry.captureException(new Error('First error'));
        }}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
