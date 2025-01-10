export function suspend(promise: Promise<unknown>): never {
  throw promise
}
