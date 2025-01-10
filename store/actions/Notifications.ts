import { Notification, NotificationAction } from '~declarations'
import ActionTypes from './types'

export const setNotifications = (
  notifications: Notification[],
): NotificationAction => {
  return {
    type: ActionTypes.SET_NOTIFICATIONS,
    payload: notifications,
  }
}

export const setNotificationsError = (): NotificationAction => {
  return {
    type: ActionTypes.SET_NOTIFICATIONS_ERROR,
  }
}

export const addNotification = (
  notification: Notification,
): NotificationAction => {
  return {
    type: ActionTypes.ADD_NOTIFICATION,
    payload: notification,
  }
}

export const addNotifications = (
  notifications: Notification[],
): NotificationAction => {
  return {
    type: ActionTypes.ADD_NOTIFICATIONS,
    payload: notifications,
  }
}

export const deleteNotification = (
  notification: Notification,
): NotificationAction => {
  return {
    type: ActionTypes.DELETE_NOTIFICATION,
    payload: notification,
  }
}

export const markNotificationAsRead = (
  notification: Notification,
): NotificationAction => {
  return {
    type: ActionTypes.MARK_NOTIFICATION_AS_READ,
    payload: notification,
  }
}

export const resetNotifications = (): NotificationAction => {
  return {
    type: ActionTypes.RESET_NOTIFICATIONS,
  }
}
