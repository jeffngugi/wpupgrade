import React, {useEffect} from 'react';
import Navigation from './navigation';
import useColorScheme from './hooks/useColorScheme';
import {mutationCache, queryCache} from '~utils/react-query/caches';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar} from 'expo-status-bar';
import NetInfo, {
  NetInfoCellularGeneration,
  NetInfoState,
  NetInfoStateType,
} from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {Dispatch} from 'redux';
import {NetworkAction} from '~declarations';
import {setNetwork} from '~store/actions/Network';

interface NetworkInfo {
  networkType: NetInfoStateType;
  networkConnected: boolean | null;
  internetReachable: boolean | null;
  details: {
    ipAddress?: string;
    subnet?: string;
    isConnectionExpensive?: boolean;
    cellularGeneration?: NetInfoCellularGeneration | null;
  };
}

export const queryClient = new QueryClient({mutationCache, queryCache});

function ClientApp() {
  const colorScheme = useColorScheme();
  const dispatch: Dispatch<NetworkAction> = useDispatch();

  useEffect(() => {
    const handleNetworkChange = async ({
      type: networkType,
      isConnected,
      isInternetReachable,
      details,
    }: NetInfoState) => {
      const networkInfo: NetworkInfo = {
        networkType,
        networkConnected: isConnected,
        internetReachable: isInternetReachable,
        details,
      };

      if (networkInfo.internetReachable !== null) {
        dispatch(setNetwork(networkInfo));
      }
    };

    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation colorScheme={colorScheme} />
      <StatusBar />
    </QueryClientProvider>
  );
}

export default ClientApp;
