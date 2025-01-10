import { isNull } from 'lodash'
import { TAState, TAAction } from '~declarations'
import ActionTypes from '~store/actions/types'

const currentState: TAState = {
  clockInsOuts: null,
}

const reducer = (state = currentState, action: TAAction) => {
  switch (action.type) {
    case ActionTypes.ADD_CLOCKINOUT: {
      const clockInsOuts = Object.assign([], state.clockInsOuts)
      clockInsOuts.push(action.payload)
      return {
        ...state,
        clockInsOuts,
      }
    }
    case ActionTypes.DELETE_CLOCKINOUT: {
      const clockInsOuts = [...state.clockInsOuts!]
      const index = clockInsOuts.findIndex(
        i => i.clockId === action.payload.clockId,
      )

      clockInsOuts.splice(index, 1)

      return {
        ...state,
        clockInsOuts,
      }
    }
    case ActionTypes.RESET_CLOCKINOUT:
      return {
        ...state,
        clockInsOuts: null,
      }
    case ActionTypes.ADD_TA_ATTEMPTS: {
      const clockInsOuts = Object.assign([], state.clockInsOuts)
      clockInsOuts.concat(action.payload)

      return {
        ...state,
        clockInsOuts: action.payload,
      }
    }
    case ActionTypes.EDIT_TA_ATTEMPT: {
      if (!isNull(state.clockInsOuts)) {
        const attemptIndex = state.clockInsOuts?.findIndex(
          item => item.clockId === action.payload.clockId,
        )
        const newArr = [...state.clockInsOuts]
        newArr[attemptIndex] = action.payload
        return {
          ...state,
          clockInsOuts: action.payload,
        }
      }

      return {
        ...state,
      }
    }
    default:
      return state
  }
}

export default reducer
