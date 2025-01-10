import { Cache, SyncCache } from './useCache'

export function createScopedCache<Value, Key extends string = string>(
  scope: string,
  cacheImplementation: SyncCache<string, Value>,
): SyncCache<Key, Value>
export function createScopedCache<
  Value extends Promise<any>,
  Key extends string = string,
>(scope: string, cacheImplementation: Cache<string, Value>): Cache<Key, Value>
export function createScopedCache<Value, Key extends string = string>(
  scope: string,
  cacheImplementation: SyncCache<string, Value> | Cache<string, Value>,
) {
  return {
    set(key: Key, value: Value) {
      return cacheImplementation.set(`${scope}.${key}`, value)
    },
    get(key: Key) {
      return cacheImplementation.get(`${scope}.${key}`)
    },
    delete(key: Key) {
      return cacheImplementation.delete(`${scope}.${key}`)
    },
  }
}
