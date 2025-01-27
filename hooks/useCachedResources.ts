import * as Font from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Sentry from '@sentry/react-native';
import SplashScreen from 'react-native-splash-screen'
import {useEffect, useState} from 'react';
import {getItem} from '~storage/device-storage';
import {setOnboarded} from '~store/actions/Onboarding';
import {
  setLockPinAvailable,
  setLockPin,
  appLock,
  setBiometricEnabled,
  skipBiometrics,
  setFaceIdEnabled,
  setLockingEnabled,
} from '~store/actions/Application';
import store from '~store';
import {loginUser} from '~store/actions/User';
import {LoggedUser} from '~declarations';
import {getSecureItem} from '~storage/secureStore';
import {isNull} from 'lodash';
import {Platform} from 'react-native';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // SplashScreen.preventAutoHideAsync()
        const isOnboarded = await getItem('isOnboarded');
        const userData: string | null = await getItem('userData');
        const lockingEnabled = await getItem('lockingEnabled');
        const locked = await getItem('locked');
        const isLocked = locked === 'true' || locked === true;
        const isLockingEnabled =
          lockingEnabled === 'true' || lockingEnabled === true;

        if (userData) {
          const user = userData as unknown as LoggedUser;
          store.dispatch(loginUser(user));
          if (isLockingEnabled && isLocked) {
            store.dispatch(appLock());
          }
        }
        if (isOnboarded) {
          store.dispatch(setOnboarded());
        }
        const biometricEnabled = await getItem('biometricEnabled');
        const skipBioMetrics = await getItem('skipBioMetrics');
        const faceIdEnabled = await getItem('faceIdEnabled');

        if (biometricEnabled === true || biometricEnabled === 'true') {
          store.dispatch(setBiometricEnabled(true));
        }

        if (skipBioMetrics === true || skipBioMetrics === 'true') {
          store.dispatch(skipBiometrics(true));
        }
        if (faceIdEnabled === true || faceIdEnabled === 'true') {
          store.dispatch(setFaceIdEnabled(true));
        }
        if (lockingEnabled === true || lockingEnabled === 'true') {
          store.dispatch(setLockingEnabled(true));
        }
        const nextPin = await getSecureItem('pin');

        if (isNull(nextPin)) {
          store.dispatch(setLockPinAvailable(false));
          store.dispatch(setLockPin(null));
        } else {
          store.dispatch(setLockPinAvailable(true));
          store.dispatch(setLockPin(nextPin));
        }
        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          ...MaterialCommunityIcons.font,
          ...Ionicons.font,
          'moderat-medium': require('../assets/fonts/Moderat-Trial-Medium.otf'),
          'moderat-regular': require('../assets/fonts/Moderat-Trial-Regular.otf'),
          TomatoGrotesk: require('../assets/fonts/TomatoGrotesk-Medium.otf'),
        });
      } catch (e) {
        if (Platform.OS === 'android') {
          SplashScreen.hide()
        }
        Sentry.captureException(e);
        console.warn(e);
      } finally {
        // if (Platform.OS === 'android') {
        //   SplashScreen.hide()
        // }
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
