import { useRef } from 'react'
import isDeepEqual from 'fast-deep-equal/es6'

/**
 * Performs a deep equality comparison between the parameter passed to two subsequent calls;
 * and only updates the return value if this comparison fails.
 *
 * This makes it handy for passing things inline, like API parameters,
 * without having to worry about having to use `React.useMemo` to memoize
 * the last parameter, which if missed would cause an infinite re-rendering loop.
 *
 * ```ts
 * // This
 * const params = useMemo(() => ({ includes: ['associated_resource', 'publisher'] }), [])
 * usePaginatedApiRequest('GET', '/events', params)
 *
 * // Becomes (`useMemoizedObject` used internally in `usePaginatedApiRequest`)
 * usePaginatedApiRequest('GET', '/events', {
 *  includes: ['associated_resource', 'publisher'],
 * })
 * ```
 *
 * Keep in mind that the comparison might be costly for complex objects,
 * particularly because it will be performed on every React update,
 * so this should only be used for small, shallow objects, like API calls parameters.
 */
export function useMemoizedObject<
  T extends {} | undefined | ArrayLike<unknown>,
>(obj: T): T {
  const prev = useRef<T>(obj)

  const { current } = prev
  if (isDeepEqual(current, obj)) {
    return current
  }

  prev.current = obj
  return obj
}
