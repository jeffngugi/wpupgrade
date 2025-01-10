import { State } from './hooks/useAsyncOperation'

export function getCombinedState<T>(
  ...states: Array<State<T>>
): State<unknown>['state'] {
  for (const state of states) {
    if (state.state === 'error') {
      return 'error'
    }

    if (state.state === 'pending') {
      return 'pending'
    }
  }

  for (const state of states) {
    if (state.state === 'idle') {
      return 'idle'
    }
  }

  return 'success'
}
