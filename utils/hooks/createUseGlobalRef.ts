import { MutableRefObject } from 'react'

export function createUseGlobalRef() {
  let initialized = false
  const object: MutableRefObject<any> = { current: null }

  return function useGlobalRef<Value>(initialValue?: Value) {
    if (!initialized) {
      object.current = initialValue
      initialized = true
    }
    return object as MutableRefObject<Value>
  }
}
