const resolvedCache = new WeakMap<any, any>()

export function useSuspenseAsyncValue<T>(promise: Promise<T>): T {
  const resolved = resolvedCache.get(promise)
  if (resolved !== undefined) {
    return resolved
  }

  throw promise.then(v => {
    resolvedCache.set(promise, v)
    return v
  })
}
