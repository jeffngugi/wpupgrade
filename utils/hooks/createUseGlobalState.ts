import { useCallback, SetStateAction, useState, useLayoutEffect } from 'react'
import { EventEmitter } from '../EventEmitter'

export function createUseGlobalState() {
  let state: any = undefined
  let initialized = false

  const emitter = new EventEmitter()
  function set(value: SetStateAction<any>) {
    const prevValue = state
    const newValue = typeof value === 'function' ? value(prevValue) : value
    state = newValue
    if (initialized && newValue !== prevValue) {
      emitter.emit('change')
    }
    initialized = true
  }

  return function useGlobalState<State>(initialValue?: SetStateAction<State>) {
    if (!initialized) {
      set(initialValue)
    }
    const [, setLocalState] = useState(state)
    const setState = useCallback((value: SetStateAction<State>) => {
      set(value)
    }, [])

    useLayoutEffect(() => {
      const applyChange = () => {
        setLocalState(state)
      }

      emitter.addListener('change', applyChange)

      return () => {
        emitter.removeListener('change', applyChange)
      }
    }, [])

    return [state as State, setState] as const
  }
}
