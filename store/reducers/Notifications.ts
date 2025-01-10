import { NotificationsState, NotificationAction } from '~declarations'
import ActionTypes from '~store/actions/types'

const currentState: NotificationsState = {
  loading: true,
  notifications: null,
  error: false,
}

const reducer = (state = currentState, action: NotificationAction) => {
  switch (action.type) {
    case ActionTypes.SET_NOTIFICATIONS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
      }
    case ActionTypes.SET_NOTIFICATIONS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      }
    case ActionTypes.ADD_NOTIFICATION: {
      const notifications = Object.assign([], state.notifications)

      notifications.push(action.payload)

      return {
        ...state,
        notifications,
      }
    }
    case ActionTypes.ADD_NOTIFICATIONS: {
      const notifications = Object.assign([], state.notifications)

      notifications.concat(action.payload)

      return {
        ...state,
        notifications,
      }
    }
    case ActionTypes.DELETE_NOTIFICATION: {
      const notifications = [...state.notifications!]
      const index = notifications.findIndex(i => i.id === action.payload.id)

      notifications.splice(index, 1)

      return {
        ...state,
        notifications,
      }
    }
    case ActionTypes.MARK_NOTIFICATION_AS_READ: {
      const notifications = [...state.notifications!]
      const index = notifications.findIndex(i => i.id === action.payload.id)
      const target = notifications[index]

      target.read = true
      notifications.splice(index, 1, target)

      return {
        ...state,
        notifications,
      }
    }
    case ActionTypes.RESET_NOTIFICATIONS:
      return {
        ...state,
        loading: false,
        error: false,
      }
    default:
      return state
  }
}

export default reducer
