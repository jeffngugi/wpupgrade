import { State, SuccessState } from './useAsyncOperation'
import { useRef } from 'react'
import { useTimeout } from './useTimeout'

export type CachedState<Data, Err extends Error = Error> =
  | State<Data, Err>
  | StaleState<Data>

export type SuccessOrStaleState<Data> = StaleState<Data> | SuccessState<Data>

/**
 * Augments `State<Data, Err>`, as returned from `useAsyncOperation` with a new type
 * of state: `'stale'`. This means that this operation has run before and is now
 * running again. The previous result/error will be preserved while the data
 * is being refreshed. This is useful for displaying data like lists of devices
 * and refresh that list when the screen appears without destroying the entire list
 * and displaying a loading spinner. Instead, the `result` will be kept to render the list
 * and you can check if `state.state === 'stale'` to display a loading spinner on top
 * of the list (like pull to refresh).
 * @param state
 */
export function useCachedState<Data, Err extends Error = Error>(
  state: State<Data, Err>,
  {
    shouldCache = defaultShouldCache,
    initialState = undefined,
    timeoutMs = null,
  }: UseCachedStateConfig<Data, Err> = {},
): State<Data, Err> | StaleState<Data> {
  const prev = useRef<State<Data, Err> | undefined>(initialState)
  const hasTimedOut = useTimeout(timeoutMs)

  const { current } = prev
  if (
    current !== undefined &&
    current.state === 'success' &&
    !shouldCache(state, current) &&
    !hasTimedOut
  ) {
    return {
      ...current,
      state: 'stale',
    }
  }

  prev.current = state
  return state
}

export type StaleState<Data> = Omit<SuccessState<Data>, 'state'> & {
  state: 'stale'
}

function defaultShouldCache<Data, Err extends Error>(
  { state }: State<Data, Err>,
  previous?: State<Data, Err>,
) {
  if (state === 'error') {
    return false
  }

  if (state === 'success' || state === 'idle') {
    return true
  }

  if (previous !== undefined) {
    return state === 'pending' && previous.state === 'idle'
  }

  return false
}

export type UseCachedStateConfig<Data, Err extends Error> = {
  initialState?: State<Data, Err>
  shouldCache?(
    state: State<Data, Err>,
    prev: State<Data, Err> | undefined,
  ): boolean

  /**
   * How long should "stale" state be tolerated.
   * When this timeout is hit, the state will fall back to "pending".
   *
   * `null` turns of the timer so the state never falls back to "pending".
   */
  timeoutMs?: number | null
}
