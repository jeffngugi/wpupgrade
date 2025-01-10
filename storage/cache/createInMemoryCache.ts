import { SyncCache } from './useCache'
import QuickLRU from 'quick-lru'

export function createInMemoryCache<
  Value,
  Key extends string = string,
>(): SyncCache<Key, Value> {
  const cache = new QuickLRU<string, Value>({ maxAge: 5000, maxSize: 1000 })

  return {
    set(key: Key, value: Value) {
      cache.set(key, value)
    },
    get(key: Key) {
      return cache.get(key)
    },
    delete(key: Key) {
      cache.delete(key)
      return undefined
    },
  }
}
