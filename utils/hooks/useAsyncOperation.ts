import { useCallback, useRef } from 'react'
import { usePrevious } from './usePrevious'
import { useMountedState } from './useMountedState'

export type SuccessState<Data> = { state: 'success'; result: Data; error: null }

export type ErrorState<Err extends Error> = {
  state: 'error'
  result: undefined
  error: Err
}

export type PendingState = { state: 'pending'; result: undefined; error: null }

export type IdleState = { state: 'idle'; result: undefined; error: null }

export type State<Data, Err extends Error = Error> =
  | SuccessState<Data>
  | ErrorState<Err>
  | PendingState
  | IdleState

export type DataFromState<S extends State<any>> = Exclude<
  S['result'],
  undefined
>

export type ErrorFromState<S extends State<any>> = Exclude<S['error'], null>

export type SuccessStateFromAnyState<S extends State<any, any>> = SuccessState<
  DataFromState<S>
>

export type ErrorStateFromAnyState<S extends State<any, any>> = ErrorState<
  ErrorFromState<S>
>

export const defaultState: IdleState = {
  state: 'idle',
  result: undefined,
  error: null,
}

const defaultIsCancel = () => false

export type AsyncOperationReturnType<
  Data,
  Err extends Error,
  Params extends any[],
> = readonly [run: Run<Data, Params>, state: AsyncOperationState<Data, Err>]

export type AsyncOperationState<Data, Err extends Error> = State<Data, Err> & {
  previous?: State<Data, Err>
  dismiss: () => void
}

export type Run<Data, Params extends any[]> = (
  ...args: Params
) => (() => void) & {
  promise: Promise<Data | undefined>
}

export type DataFromAsyncOperationReturnType<
  T extends AsyncOperationReturnType<any, any, any>,
> = DataFromState<T[1]>
export type ErrorFromAsyncOperationReturnType<
  T extends AsyncOperationReturnType<any, any, any>,
> = ErrorFromState<T[1]>
export type StateFromAsyncOperationReturnType<
  T extends AsyncOperationReturnType<any, any, any>,
> = T[1]

/**
 * @param _fn The asynchronous function to execute.
 * @param deps The dependency array for the function (matches what you would pass to `React.useCallback`)
 * @param cancelFn Optional cancellation function to abort the operation. For example,
 * this could be a function which calls `.abort` on an XHR request, or `.cancel` on cancellation source used
 * with Axios.
 * @return A an array with 2 elements, first one
 * is the function to call to start the async operation, the 2nd element is a state object tracking the progress
 * of the operation, allowing dismissing, and providing access to previous state too.
 * The function that's called to start returns a cancel function
 */
export function useAsyncOperation<
  Data,
  Params extends any[],
  Err extends Error = Error,
>(
  _fn: (...args: Params) => PromiseLike<Data>,
  deps: any[] = [_fn],
  cancelFn: undefined | (() => void) = undefined,
  isCancel: (error: unknown) => boolean = defaultIsCancel,
): AsyncOperationReturnType<Data, Err, Params> {
  const [state, setRequestState] =
    useMountedState<State<Data, Err>>(defaultState)
  const previous = usePrevious(state)
  const dismissedFunctions = useRef(new WeakSet())

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fn = useCallback(_fn, deps)

  // "Dismiss" does not mean "cancel". The async function will continue to execute
  // and may throw. This just means that we're not interested in the result.
  // Errors must still be handled properly.
  const dismiss = useCallback(() => {
    dismissedFunctions.current.add(fn)
    setRequestState(defaultState)
  }, [fn, setRequestState])

  const cancel = useCallback(() => {
    dismiss()
    if (cancelFn) {
      cancelFn()
    }
  }, [cancelFn, dismiss])

  const run: Run<Data, Params> = useCallback(
    (...args: Params) => {
      async function _run() {
        try {
          setRequestState({ state: 'pending', result: undefined, error: null })
          dismissedFunctions.current.delete(fn)
          const result = await fn(...args)
          if (!dismissedFunctions.current.has(fn)) {
            setRequestState({ state: 'success', result, error: null })
            return result
          }
        } catch (error) {
          if (!dismissedFunctions.current.has(fn) && !isCancel(error)) {
            setRequestState({ state: 'error', result: undefined, error })
            throw error
          }
        }
      }

      const promise = _run()

      return Object.assign(cancel, { promise })
    },
    [fn, isCancel, cancel, setRequestState],
  )

  return [run, { ...state, dismiss, previous }]
}
