import memoize from 'lodash/memoize';
import hashIt from 'hash-it';
import React, {createContext, PropsWithChildren, useContext} from 'react';
import {createInMemoryCache} from './createInMemoryCache';
import {createListenableCache} from './createListenableCache';
import {createScopedCache} from './createScopedCache';
import {devicePersistedCache} from './devicePersistedCache';
import {AnyCache, CacheDuration} from './useCache';
import {assertUnreachable} from '../../utils/assertUnreachable';

export type CreateMemoizedCacheConfig = {
  duration: CacheDuration;
  fullScope: string;
  type?: 'sync' | 'async';
};

type GetOrCreateCache = <Key extends string, Value>(
  config: CreateMemoizedCacheConfig,
) => AnyCache<Key, Value>;

type CacheInstanceContext = {
  cacheStore: CacheStore;
  currentUserId: string | null;
};

const CacheInstanceContext = createContext<CacheInstanceContext>({
  cacheStore: createCacheStoreGetter(),
  currentUserId: null,
});

export type CacheStore = GetOrCreateCache;

export function CacheInstanceProvider({
  children,
  cacheStore,
  currentUserId,
}: PropsWithChildren<{
  cacheStore: CacheStore;
  currentUserId: string | null;
}>) {
  return (
    <CacheInstanceContext.Provider value={{cacheStore, currentUserId}}>
      {children}
    </CacheInstanceContext.Provider>
  );
}

function useGetOrCreateCache() {
  const {cacheStore} = useContext(CacheInstanceContext);

  return cacheStore;
}

export function useCacheInstance<Key extends string, Value>(
  config: CreateMemoizedCacheConfig,
) {
  const getOrCreateCache = useGetOrCreateCache();
  return getOrCreateCache<Key, Value>(config);
}

export function useCacheUserId() {
  return useContext(CacheInstanceContext).currentUserId;
}

export function useCacheStore() {
  return useContext(CacheInstanceContext).cacheStore;
}

function getHashForConfig(config: CreateMemoizedCacheConfig) {
  return hashIt(config);
}

export function createCacheStoreGetter() {
  return memoize(
    <Key extends string, Value>({
      duration,
      fullScope,
      type = 'sync',
    }: CreateMemoizedCacheConfig) => {
      let cacheImplementation: AnyCache<Key, Value>;
      if (duration === 'memory' || type === 'sync') {
        cacheImplementation = createInMemoryCache<Value, Key>();
      } else if (duration === 'persistent') {
        cacheImplementation = devicePersistedCache;
      } else {
        assertUnreachable(duration);
      }

      const scopedCache = createScopedCache<Value, Key>(
        fullScope,
        cacheImplementation as any,
      );
      if (type === 'async') {
        return createListenableCache<Value, Key>(scopedCache);
      }

      return scopedCache as any;
    },
    getHashForConfig,
  );
}
