import { useState, useCallback } from 'react'

/**
 * Similar to React's built-in `useState` hook, but calling `setState`
 * here won't overwrite the whole state object. The passed argument will
 * merge with the existing state object.
 * This is similar to how `this.setState()` works in class components.
 */
export function usePatchState<T extends {}>(initialState: T) {
  const [state, set] = useState<T>(initialState)
  const patchState: PatchStateDispatch<T> = useCallback(patch => {
    set(prevState => ({
      ...prevState,
      ...(typeof patch === 'function' ? patch(prevState) : patch),
    }))
  }, [])

  return [state, patchState] as const
}

export type PatchStateDispatch<T> = (
  patch: ((patch: Partial<T>) => void) | (Partial<T> | undefined),
) => void
