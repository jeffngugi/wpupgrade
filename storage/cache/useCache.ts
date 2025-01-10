import { useMemo } from 'react'
import { assertUnreachable, generateRandomString } from '../../utils'
import compact from 'lodash/compact'
import { ListenableCache } from './createListenableCache'
import {
  CreateMemoizedCacheConfig,
  useCacheInstance,
  useCacheUserId,
} from './CacheProvider'

export type CacheDuration = 'persistent' | 'memory'
export type CacheScope = 'user' | 'device'

/**
 * Provides a convenient way to obtain a pre-configured cache instance which is also optionally namespaced
 * for the current environment (e.g. API URL) and user/account IDs to avoid data leaks across users
 * or environments.
 * @param namespace Arbitrary string to describe the purpose of the cache instance, e.g. 'preferences'
 */
export function useCache<Value, Key extends string = string>(
  namespace: string,
  scope: CacheScope,
  duration: CacheDuration,
): ListenableCache<Key, Value> {
  const config = useScopedCacheConfig(namespace, scope, duration)

  return useCacheInstance({
    ...config,
    type: 'async',
  }) as ListenableCache<Key, Value>
}

export function useSynchronousCache<Value, Key extends string = string>(
  namespace: string,
  scope: CacheScope,
  duration: CacheDuration,
): SyncCache<Key, Value> {
  const config = useScopedCacheConfig(namespace, scope, duration)

  return useCacheInstance<Key, Value>({ ...config, type: 'sync' }) as SyncCache<
    Key,
    Value
  >
}

function useScopedCacheConfig(
  namespace: string,
  scope: CacheScope,
  duration: CacheDuration,
): CreateMemoizedCacheConfig {
  const currentUserId = useCacheUserId()

  const canUseCache = useMemo(() => {
    if (scope === 'device') {
      return true
    }

    if (scope === 'user') {
      return currentUserId !== null
    }

    assertUnreachable(scope)
  }, [scope, currentUserId])

  const namespaceId = useMemo(() => {
    if (scope === 'user' && currentUserId !== null) {
      return currentUserId ?? generateRandomString()
    }

    return null
  }, [scope, currentUserId])

  const fullScope = compact([scope, namespace, namespaceId]).join('.')

  return { fullScope, duration: canUseCache ? duration : 'memory' }
}

export type Cache<Key extends string, Value> = {
  get(key: Key): Promise<Value | undefined>
  set(key: Key, value: Value): Promise<void>
  delete(key: Key): Promise<void>
}

export type SyncCache<Key extends string, Value> = {
  get(key: Key): Value | undefined
  set(key: Key, value: Value): void
  delete(key: Key): void
}

export type AnyCache<Key extends string, Value> =
  | Cache<Key, Value>
  | SyncCache<Key, Value>
