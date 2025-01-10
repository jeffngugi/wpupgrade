import { useCallback, useMemo, useEffect } from 'react'
import {
  MaybeLazyAsync,
  UnboxMaybeLazyAsync,
  useDebugCompareWithPrevious,
} from '../../utils'
import useForceUpdate from 'use-force-update'
import { CacheEventHandler } from './createListenableCache'
import {
  CacheDuration,
  CacheScope,
  useCache,
  useSynchronousCache,
} from './useCache'
import { suspend, fail } from '../../suspense-compat'

type UseSuspenseCacheValueConfig<Value> = {
  defaultValue?: MaybeLazyAsync<Value, [key: string]>
  /** An arbitrary string to indicate the purpose of the cache, e.g. `'preferences'` */
  namespace: string
  scope: CacheScope
  duration: CacheDuration
  /** Whether the last fetched value should be kept while a new value is being fetched from async cache */
  keepStale?: boolean
}

export type SuspenseCacheValueController = {
  refresh(): Promise<void>
}

type Return<Value> = Readonly<
  [
    data: UnboxMaybeLazyAsync<Value>,
    set: (newValue: Value) => Promise<void>,
    controller: SuspenseCacheValueController,
  ]
>

/**
 * This is a Suspense-based cache reader implementation.
 * TL;DR: It allows us to read an asynchronous value from a cache as if it is already available, synchronously.
 *
 * ## How does it work?
 * React allows any component to _throw_ an `Error`, and this would propagate
 * up the component tree until React finds an "Error Boundary" component.
 *
 * Similarly, React Suspense allows any component to _throw_ a _`Promise`_,
 * but in this special case, it would not be considered an "error", instead,
 * it would indicate to React that the component is not ready to be rendered
 * and is waiting for the thrown promise to settle before it can display its
 * content. React will wait for that promise to settle, and then re-attempt
 * to render the same component, showing a "Suspense Boundary" component meanwhile
 * (which is also looked up the tree, similar to an Error Boundary).
 * After the promise settles, the data should have already
 * been loaded, and the component should have stored the data somewhere outside
 * of React to read it synchronously this time.
 * If the promise rejects, React will be treat that as a component error, showing
 * the nearest error boundary.
 *
 * This hook enables this async-then-sync cache strategy by trying to read from
 * the sync cache first, falling back to the equivalent async cache second, and
 * lastly trying to read the value from the supplied `defaultValue` (if any).
 * If `defaultValue` is a function (or an async function), it will be awaited
 * and the value would be stored in cache for next time it is needed.
 */
export function useSuspenseCacheValue<Value, Key extends string = string>(
  key: Key,
  {
    defaultValue = undefined,
    namespace,
    scope,
    duration,
    keepStale = false,
  }: UseSuspenseCacheValueConfig<Value>,
): Return<Value> {
  const forceUpdate = useForceUpdate()
  const asyncCache = useCache<Value, Key>(namespace, scope, duration)
  const syncCache = useSynchronousCache<Value, Key>(namespace, scope, duration)
  const loadedKeys = useSynchronousCache<boolean, Key>(
    `${namespace}_loaded_keys`,
    scope,
    'memory',
  )
  const failedKeys = useSynchronousCache<Error, Key>(
    `${namespace}_failed_keys`,
    scope,
    'memory',
  )
  useDebugCompareWithPrevious(syncCache, {
    debugName: `Sync cache for ${key} ${namespace} ${scope} ${duration}`,
    isEqual: (first, second) => first === second,
  })

  const read = useCallback(async () => {
    try {
      loadedKeys.set(key, true)
      failedKeys.delete(key)

      const value = await (async () => {
        const value = await asyncCache.get(key)
        if (value !== undefined) {
          return value
        }

        if (typeof defaultValue === 'function') {
          // @ts-expect-error TS fails to narrow down function type
          return await defaultValue(key)
        }

        return defaultValue
      })()

      syncCache.set(key, value)
      forceUpdate()
    } catch (error) {
      failedKeys.set(key, error as unknown as Error)
    }
  }, [
    asyncCache,
    loadedKeys,
    key,
    defaultValue,
    forceUpdate,
    failedKeys,
    syncCache,
  ])

  useEffect(() => {
    const listener: CacheEventHandler<Value, Key> = (operation, value) => {
      if (operation === 'delete') {
        failedKeys.delete(key)
        loadedKeys.set(key, false)
      } else {
        failedKeys.delete(key)
        loadedKeys.set(key, true)
        if (value !== undefined) {
          syncCache.set(key, value)
        }
      }
      forceUpdate()
    }

    asyncCache.addListener(key, listener)

    return () => {
      asyncCache.removeListener(key, listener)
    }
  }, [key, asyncCache, syncCache, failedKeys, loadedKeys, forceUpdate])

  const set = useCallback(
    async (value: Value) => {
      const prepare = async () => {
        if (!keepStale) {
          await asyncCache.delete(key)
        }
      }

      await prepare()

      failedKeys.delete(key)
      return asyncCache.set(key, value)
    },
    [key, keepStale, failedKeys, asyncCache],
  )

  const refresh = useCallback(async () => {
    if (!keepStale) {
      syncCache.delete(key)
    }
    await asyncCache.delete(key)
    failedKeys.delete(key)
    loadedKeys.delete(key)
    await read()
  }, [key, loadedKeys, failedKeys, keepStale, asyncCache, syncCache, read])

  useDebugCompareWithPrevious(refresh, {
    debugName: `Refresh function for ${key} ${scope} ${namespace} ${duration}`,
  })

  const controller = useMemo(
    () => ({
      refresh,
    }),
    [refresh],
  )

  const value = syncCache.get(key)
  const isKeyLoaded = loadedKeys.get(key) === true
  const error = failedKeys.get(key)

  if (error) {
    fail(error, refresh)
  }

  if (value !== undefined) {
    if (isKeyLoaded || keepStale) {
      // @ts-ignore
      return [value, set, controller]
    }
  }

  if (isKeyLoaded && typeof defaultValue !== 'function') {
    // @ts-ignore
    return [defaultValue, set, controller]
  }

  suspend(read())
}
