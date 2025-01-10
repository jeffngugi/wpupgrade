import { NetInfoStateType } from '@react-native-community/netinfo'
import { NetworkState, NetworkAction } from '~declarations'
import ActionTypes from '~store/actions/types'

const currentState: NetworkState = {
  networkType: NetInfoStateType.none,
  networkConnected: true,
  internetReachable: true,
  details: {
    isConnectionExpensive: false,
  },
}

const reducer = (state = currentState, action: NetworkAction) => {
  switch (action.type) {
    case ActionTypes.SET_NETWORK:
      return {
        ...state,
        internetReachable: action.payload.internetReachable,
        networkConnected: action.payload.networkConnected,
        details: action.payload.details,
        networkType: action.payload.networkType,
      }
    default:
      return state
  }
}

export default reducer
