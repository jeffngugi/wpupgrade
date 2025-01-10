import axios from 'axios';
import {useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {ColorSchemeName, StyleSheet, View, AppStateStatus} from 'react-native';
import {RootStackParamList} from '../types';
import AuthStackNavigator from './AuthStackNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import {ApplicationAction, State} from '../declarations';
import {Box} from 'native-base';
import UpgradeScreen from '~components/UpgradeScreen';
import {useDebouncedAppState} from '~hooks/useAppState';
import {appLock} from '~store/actions/Application';
import MainApp from './MainApp';
import {useRequireUpdate} from '~hooks/useRequireUpdate';
import PinCodeScreen from '~screens/authentication/pincode';
import {analyticsLogPage} from '~utils/analytics';
import {getSecureItem, storeSecureItem} from '~storage/secureStore';

const ONE_MINUTE = 60 * 1000;

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const {isLoggedIn} = useSelector((state: State) => state.user);

  const {locked, lockingEnabled} = useSelector(
    (state: State) => state.application,
  );
  const now = Date.now();
  const lockInterval = ONE_MINUTE * 2;
  const expireTime = now - lockInterval;

  const updateRequired = useRequireUpdate();
  const navigationRef = useRef(null);
  const routeNameRef = useRef(null);

  const dispatch: React.Dispatch<ApplicationAction> = useDispatch();
  const handleAppLock = async (appstate: AppStateStatus) => {
    console.log('app state from nav', appstate);
    const active = appstate === 'active';
    const lastIdleString = (await getSecureItem('lastIdle')) as any;
    const lastIdle = Number.parseInt(lastIdleString, 10);
    if (locked) {
      return;
    }
    if (appstate === 'inactive' || appstate === 'background') {
      // console.log("app state from bac")
      await storeSecureItem('lastIdle', Date.now().toString());
      return;
    }
    const lastIdleExpired = lastIdle && expireTime > lastIdle;
    if (active && lastIdleExpired && lockingEnabled) {
      dispatch(appLock());
    }
  };

  React.useEffect(() => {
    // dispatch(appLock())
  }, []);

  useDebouncedAppState(handleAppLock);

  return (
    <NavigationContainer
      // linking={LinkingConfiguration}
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef?.current.getCurrentRoute().name;
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          analyticsLogPage(currentRouteName);
          routeNameRef.current = currentRouteName;
        }
      }}>
      <View style={styles.container}>
        <RootNavigator />
        {isLoggedIn ? (
          updateRequired || locked ? (
            <Box style={styles.locked} safeArea>
              {updateRequired ? <UpgradeScreen /> : <PinCodeScreen />}
            </Box>
          ) : null
        ) : null}
      </View>
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const {environments, current} = useSelector(
    (state: State) => state.environments,
  );
  const {isLoggedIn} = useSelector((state: State) => state.user);

  /**
   * To do check if token is valid and logout user
   * NOTE: This will be implemented once we figure out how to deal with long-timed(non-expiring) tokens
   */

  // Axios defaults
  axios.defaults.baseURL = environments[current];
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen
          name="MainScreens"
          component={MainApp}
          options={{headerShown: false}}
        />
      ) : (
        <Stack.Screen
          name="AuthScreens"
          component={AuthStackNavigator}
          options={{headerShown: false}}
        />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  locked: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: 'white',
  },
});
