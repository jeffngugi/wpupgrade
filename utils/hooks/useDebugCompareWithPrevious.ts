import { usePrevious, ShouldRemember } from './usePrevious'
import defaultIsEqual from 'fast-deep-equal'

type Config<T> = {
  debugName: string
  disabled?: boolean
  isEqual?: IsEqual<T>
  shouldRemember?: ShouldRemember<T>
}

export function useDebugCompareWithPrevious<T>(
  value: T,
  {
    debugName,
    disabled = false,
    isEqual = defaultIsEqual,
    shouldRemember = defaultShouldRemember,
  }: Config<T>,
) {
  const previousValue = usePrevious(value, shouldRemember)

  if (disabled || process.env.NODE_ENV !== 'development') {
    return
  }

  if (previousValue === undefined) {
    return false
  }

  if (!isEqual(previousValue, value)) {
    console.debug(
      `${debugName} changed between renders. Prev:`,
      previousValue,
      'Current:',
      value,
    )
  }
}

function defaultShouldRemember() {
  return true
}

type IsEqual<T> = (current: T, next: T) => boolean
