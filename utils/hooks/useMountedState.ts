import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * A drop-in replacement for React's setState with the difference being that calls to
 * this implementation's setState will be to a no-op if the component is not mounted.
 * This avoids `Warning: setState(…): Can only update a mounted or mounting component.
 * This usually means you called setState() on an unmounted component.`
 */
export function useMountedState<T>(initialValue: T) {
  const [state, setState] = useState(initialValue)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  })

  const setStateOnlyIfMounted = useCallback((state: T) => {
    if (isMounted.current === false) {
      return
    }
    setState(state)
  }, [])

  return [state, setStateOnlyIfMounted] as const
}
