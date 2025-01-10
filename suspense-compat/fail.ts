import { SuspenseCompatActualError } from './SuspenseCompatActualError'

export function fail(error: Error, retry?: () => void): never {
  throw new SuspenseCompatActualError(error, retry)
}
