import { useState } from 'react'

/**
 * Similar to `useState`, except it returns a value from a given list of values
 * indexed by keys (e.g. `{ key1: value1, key2: value2 }`). The second value in the
 * returned tuple allows you to set the active value by its key (e.g. `setValue(key1)`).
 *
 * TypeScript will help enforce that you can only pass valid keys to `setValue`.
 */
export function useMapValue<Value, Key extends keyof Value>(
  map: Value,
  initialValue: Key,
) {
  const [key, setValueByKey] = useState<Key>(initialValue)
  const value = map[key]

  return [value, setValueByKey] as const
}
