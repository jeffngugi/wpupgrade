import { NetworkAction, NetworkState } from '~declarations'
import ActionTypes from './types'

export const setNetwork = (networkInfo: NetworkState): NetworkAction => {
  return {
    type: ActionTypes.SET_NETWORK,
    payload: networkInfo,
  }
}
