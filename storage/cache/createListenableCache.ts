import { EventEmitter } from '../../utils/EventEmitter'
import { Cache, AnyCache } from './useCache'

/**
 * Extends a cache implementation to be listenable (listeners are notified of delete/set operations).
 */
export function createListenableCache<Value, Key extends string = string>(
  cacheImplementation: AnyCache<Key, Value>,
): ListenableCache<Key, Value> {
  const emitter = new EventEmitter<Key, CacheEvents<Value, Key>>()

  return {
    ...cacheImplementation,
    async get(key: Key) {
      const result = await Promise.resolve(cacheImplementation.get(key))
      return result
    },
    async set(key: Key, value: Value) {
      const result = await cacheImplementation.set(key, value)
      // @ts-ignore
      emitter.emit(key, 'set', value)
      return result
    },
    async delete(key: Key) {
      const result = await cacheImplementation.delete(key)
      // @ts-ignore
      emitter.emit(key, 'delete', result)
      return result
    },
    addListener: emitter.addListener.bind(emitter),
    removeListener: emitter.removeListener.bind(emitter),
  }
}

type CacheEvents<Value, Key extends string = string> = Record<
  Key,
  (...data: ['set', Value] | ['delete', void]) => void
>

export type CacheEventHandler<Value, Key extends string = string> = CacheEvents<
  Value,
  Key
>[Key]

export type ListenableCache<Key extends string, Value> = Cache<Key, Value> &
  Pick<
    EventEmitter<Key, CacheEvents<Value, Key>>,
    'removeListener' | 'addListener'
  >
