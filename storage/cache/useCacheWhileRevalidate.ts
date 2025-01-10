import { useEffect } from 'react'
import { AsyncOperationReturnType } from '../../utils'
import { UseCachedStateConfig } from '../../utils'
import { ListenableCache } from './createListenableCache'
import { usePersistedCachedState } from './usePersistedCachedState'

/**
 * Uses the last successful result of a certain async operation (as identified by the cache key)
 * while the fresh result is being calculated or fetched.
 *
 * When the new result comes in, it's automatically persisted to storage and used for the next
 * time this hook is called.
 *
 * This is useful for many API requests that are not necessarily critical and having an outdated
 * snapshot for the response is okay. For example, the number of devices in a certain location that
 * is displayed in each tile in the location's list.
 */
export function useCacheWhileRevalidate<
  Data,
  Err extends Error = Error,
  Operation extends AsyncOperationReturnType<
    Data,
    Err,
    []
  > = AsyncOperationReturnType<Data, Err, []>,
>(
  cache: ListenableCache<string, unknown>,
  cacheKey: string | undefined,
  run: Operation[0],
  state: Operation[1],
  config: UseCachedStateConfig<Data, Err> = {},
) {
  const persistedState = usePersistedCachedState(cache, cacheKey, state, config)

  useEffect(() => {
    if (state.state === 'idle' || persistedState.state === 'stale') {
      run()
    }
  }, [run, state.state, persistedState.state])

  return persistedState
}
