/**
 * This error, when thrown, indicates to the compat layer that it should wait until the promise
 * it wraps is completed.
 *
 * @internal This is an implementation detail and should not be exported outside of the package
 */
export class SuspenseCompatPromiseError<T> extends Error {
  promise: Promise<void>
  data: T | undefined
  error: Error | undefined

  constructor(promise: Promise<T>) {
    super('SuspenseCompatPromiseError')
    this.promise = promise
      .then(data => {
        this.data = data
      })
      .catch(error => {
        this.error = error
      })
  }
}
