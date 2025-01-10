import { SuspenseCompatActualError } from './SuspenseCompatActualError'

export function unwrap<T extends Error | null>(obj: T): Error | null {
  if (obj instanceof SuspenseCompatActualError) {
    return obj.error
  }

  return obj
}
