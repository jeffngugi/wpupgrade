import { useEffect, useRef } from 'react'

export function usePrevious<T>(
  value: T,
  shouldRemember: ShouldRemember<T> = defaultShouldRemember,
): T | undefined {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T | undefined>(undefined)

  // Store current value in ref
  useEffect(() => {
    if (shouldRemember(ref.current, value)) {
      ref.current = value
    }
  }, [shouldRemember, value]) // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current
}

function defaultShouldRemember() {
  return true
}

export type ShouldRemember<T> = (current: T | undefined, next: T) => boolean
