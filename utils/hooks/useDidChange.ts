import { usePrevious, ShouldRemember } from './usePrevious'
import defaultIsEqual from 'fast-deep-equal'

export function useDidChange<T>(
  value: T,
  isEqual: IsEqual<T> = defaultIsEqual,
  shouldRemember: ShouldRemember<T> = defaultShouldRemember,
): boolean {
  const previousValue = usePrevious(value, shouldRemember)

  if (previousValue === undefined) {
    return false
  }

  return !isEqual(previousValue, value)
}

function defaultShouldRemember() {
  return true
}

type IsEqual<T> = (current: T, next: T) => boolean
