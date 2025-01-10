import { createUseGlobalMemo, areShallowEqual } from './createUseGlobalMemo'

/**
 * For each call, returns a drop-in replacement for useCallback, with the difference being that
 * the deps are remembered outside of React's tree. This makes it possible
 * to keep a callback memoized even after the component containing it unmounts entirely.
 *
 * This comes with some caveats and you should only use this with caution -- the callback
 * must be scoped properly and not re-used for callbacks serving different purposes.
 *
 * ```tsx
 *
 * ```
 */
export function createUseGlobalCallback(areEqual = areShallowEqual) {
  const _useMemo = createUseGlobalMemo(areEqual)

  return function useGlobalCallback<Callback extends (...args: any[]) => any>(
    callback: Callback,
    deps: unknown[],
  ): Callback {
    return _useMemo(() => callback, deps)
  }
}
