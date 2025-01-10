import { useEffect, useLayoutEffect } from 'react'
import { State, useAsyncOperation } from '../../utils'
import { useCachedState, StaleState, UseCachedStateConfig } from '../../utils'
import { ListenableCache } from './createListenableCache'

export function usePersistedCachedState<Data, Err extends Error = Error>(
  cache: ListenableCache<string, unknown>,
  key: string | undefined,
  state: State<Data, Err>,
  config: UseCachedStateConfig<Data, Err> = {},
): State<Data, Err> | StaleState<Data> {
  const cachedState = useCachedState(state, config)
  const [loadPersisted, { result: lastPersistedResult, state: loadState }] =
    useAsyncOperation(async () => {
      if (key === undefined) {
        return undefined
      }
      return cache.get(key) as Promise<Data | undefined>
    }, [cache, key])

  useEffect(
    function persistFreshResult() {
      if (key === undefined) {
        return
      }
      if (cachedState.state === 'success') {
        cache.set(key, cachedState.result)
      }
    },
    [cache, key, loadPersisted, cachedState.state, cachedState.result],
  )

  useLayoutEffect(() => {
    return loadPersisted()
  }, [loadPersisted])

  useEffect(
    function reloadOnCacheInvalidated() {
      if (key === undefined) {
        return
      }

      const listener = (operation: 'delete' | 'set', _value: any) => {
        if (operation === 'delete') {
          loadPersisted()
        }
      }

      cache.addListener(key, listener)

      return () => {
        cache.removeListener(key, listener)
      }
    },
    [key, cache, loadPersisted],
  )

  if (key === undefined || cachedState.state === 'success') {
    return cachedState
  }

  if (loadState === 'idle' || loadState === 'pending') {
    return { state: 'pending', result: undefined, error: null }
  }

  if (loadState === 'success' && lastPersistedResult !== undefined) {
    return { state: 'stale', result: lastPersistedResult, error: null }
  }

  return cachedState
}
