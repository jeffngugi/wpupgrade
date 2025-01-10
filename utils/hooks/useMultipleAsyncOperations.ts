import { useCallback } from 'react'
import { fromPairs, mapValues } from 'lodash'

import {
  AsyncOperationReturnType,
  State,
  ErrorFromAsyncOperationReturnType,
  StateFromAsyncOperationReturnType,
  Run,
} from './useAsyncOperation'
import { getCombinedState } from '../getCombinedState'
import { usePrevious } from './usePrevious'
import { useMemoizedObject } from './useMemoizedObject'

/**
 * A convenient way to perform multiple async operations referenced by
 * a key, e.g.
 *
 * ```ts
 * {
 *  operation1: useAsyncOperation(),
 *  operation2: ...
 *  operation3: ...
 * }
 * ```
 * The result will be a `State` object whose `result` is of the shape:
 * ```ts
 * {
 *   operation1: result1,
 *   operation2: result2,
 *   operation3: result3,
 * }
 * ```
 * and whose `error` will be an instance of `CombinedAsyncStateError` where the individual errors
 * for each operation can be accessed on that instance at `error.errors.operation1`... etc.
 */
export function useMultipleAsyncOperations<
  DataMap extends { [x: string]: any },
  OperationsMap extends BaseMapFromDataMap<DataMap> = BaseMapFromDataMap<DataMap>,
>(
  operationsByKey: OperationsMap,
): AsyncOperationReturnType<
  DataMap,
  CombinedAsyncStateError<OperationsMap>,
  []
> {
  const states = mapValues(
    operationsByKey,
    ([, state]) => state,
  ) as StateMap<OperationsMap>
  const statesArray = Object.values(states)
  const combinedState = getCombinedState(...statesArray)
  const state = call(() => {
    if (combinedState === 'error') {
      return {
        state: combinedState,
        result: undefined,
        error: new CombinedAsyncStateError(
          mapValues(states, state => state.error) as ErrorMap<OperationsMap>,
        ),
      }
    }

    if (combinedState === 'success') {
      return {
        state: combinedState,
        result: mapValues(states, state => state.result) as DataMap,
        error: null,
      }
    }

    return { state: combinedState, error: null, result: undefined }
  })
  const previous = usePrevious(state, shouldRememberPrevious)
  const dismiss = () => {
    callAll(...statesArray.map(({ dismiss }) => dismiss))
  }
  const keys = useMemoizedObject(Object.keys(operationsByKey))
  const memoizedFns = useMemoizedObject(
    Object.values(operationsByKey).map(([run]) => run as Run<any, any>),
  )

  const runAll = useCallback(() => {
    const cleanFns = callAll(...memoizedFns)
    const promise = new Promise<DataMap>((resolve, reject) => {
      try {
        const pairs = Promise.all(
          keys.map(async (key, i) => [key, await cleanFns[i].promise]),
        ).then(fromPairs)

        resolve(pairs as any)
      } catch (error) {
        reject(error)
      }
    })

    return Object.assign(
      () => {
        callAll(...cleanFns)
      },
      { promise },
    )
  }, [memoizedFns, keys])

  return [
    runAll,
    // @ts-ignore
    { ...state, previous, dismiss },
  ]
}

function callAll<Fn extends () => any>(...fns: Fn[]): Array<ReturnType<Fn>> {
  return fns.map(fn => {
    return fn()
  })
}

function call<Fn extends () => any>(fn: Fn): ReturnType<Fn> {
  return fn()
}

function shouldRememberPrevious<T>(
  previous: State<T> | undefined,
  current: State<T>,
) {
  return previous === undefined || previous.state !== current.state
}

class CombinedAsyncStateError<T extends BaseMap<any>> extends Error {
  code = 'CombinedAsyncStateError'
  errors: ErrorMap<T>
  constructor(errorMap: ErrorMap<T>) {
    super('CombinedAsyncStateError')
    this.errors = errorMap
  }
}

type BaseMap<Data, Err extends Error = Error> = {
  [x: string]: AsyncOperationReturnType<Data, Err, []>
}

type BaseMapFromDataMap<DataMap, Err extends Error = Error> = {
  [K in keyof DataMap]: AsyncOperationReturnType<DataMap[K], Err, []>
}

type ErrorMap<T extends BaseMap<any>> = {
  [K in keyof T]: ErrorFromAsyncOperationReturnType<T[K]> | null
}

type StateMap<T extends BaseMap<any>> = {
  [K in keyof T]: StateFromAsyncOperationReturnType<T[K]>
}
