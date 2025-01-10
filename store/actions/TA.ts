import { ClockInOut, TAAction } from '~declarations'
import ActionTypes from './types'

export const addClockInOut = (clockInOut: ClockInOut): TAAction => {
  return {
    type: ActionTypes.ADD_CLOCKINOUT,
    payload: clockInOut,
  }
}

export const deleteClockInOut = (clockInOut: ClockInOut): TAAction => {
  return {
    type: ActionTypes.ADD_CLOCKINOUT,
    payload: clockInOut,
  }
}

export const resetClockInOut = (): TAAction => {
  return {
    type: ActionTypes.RESET_CLOCKINOUT,
  }
}

export const addAttempts = (attempts: ClockInOut[]): TAAction => {
  return {
    type: ActionTypes.ADD_TA_ATTEMPTS,
    payload: attempts,
  }
}

export const updateAttempt = (attempt: ClockInOut): TAAction => {
  return {
    type: ActionTypes.EDIT_TA_ATTEMPT,
    payload: attempt,
  }
}
