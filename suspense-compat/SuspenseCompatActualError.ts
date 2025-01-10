/**
 * This error, when thrown, indicates to the compat layer that it the underlying component has actually
 * failed, in contrast to an error being thrown to indicate loading state.
 *
 * @internal This is an implementation detail and should not be exported outside of the package
 */
export class SuspenseCompatActualError extends Error {
  error: Error
  retry?: () => void

  constructor(error: Error, retry?: () => void) {
    super(`SuspenseCompatActualError: ${error.message}`)
    this.error = error
    this.retry = retry
  }
}
