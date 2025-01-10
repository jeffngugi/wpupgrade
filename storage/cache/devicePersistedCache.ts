import { setItem, getItem, deleteItem } from '../device-storage'
import { Cache } from './useCache'

/** @internal Do not use this directly. Obtain a scoped persisted cache via `useCache` */
export const devicePersistedCache: Cache<string, any> = {
  set: setItem,
  get: getItem,
  delete: deleteItem,
}
