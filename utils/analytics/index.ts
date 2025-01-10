import { createClient } from '@segment/analytics-react-native'
import { AnalyticsEventsTypes } from './events'

const DEV_WRITE_KEY = 'iyG7LreHAWkxZReqoiDvTazxAeBLiEDF'
const PROD_WRITE_KEY = 'WJIhaoTSsXnqLFcwnOE11niN9locN29G'

const segmentKey =
  process.env.NODE_ENV === 'production' ? PROD_WRITE_KEY : DEV_WRITE_KEY

export const productAnalytics = createClient({
  writeKey: segmentKey,
  trackAppLifecycleEvents: true,
})

/**
 * Identifies who the user is.
 * @param {string} userId - Unique identifier for the user.
 * @param {Object} traits - Additional traits or metadata about the user.
 */
const analyticsIdentifyUser = (userId: string, traits: Record<string, any>) => {
  productAnalytics.identify(userId, traits)
}

/**
 * Tracks what the user is doing.
 * @param {string} event - The name of the event.
 * @param {Object} properties - Additional properties or metadata about the event.
 */
const analyticsTrackEvent = (
  event: AnalyticsEventsTypes,
  properties: Record<string, any>,
) => {
  productAnalytics.track(event, properties)
}

/**
 * Logs what page the user is on.
 * @param {string} name - The name of the page.
 * @param {Object} properties - Additional properties or metadata about the page view.
 */
const analyticsLogPage = (name: string, properties?: Record<string, any>) => {
  productAnalytics.screen(name, properties)
}

/**
 * Groups the user by the company they are part of.
 * @param {string} groupId - Unique identifier for the company.
 * @param {Object} traits - Additional traits or metadata about the company.
 */
const analyticsGroupUser = (groupId: string, traits: Record<string, any>) => {
  productAnalytics.group(groupId, traits)
}

/**
 * Resets the analytics state for the current user. Useful when a user logs out.
 */
const analyticsReset = () => {
  productAnalytics.reset()
}

export {
  analyticsIdentifyUser,
  analyticsTrackEvent,
  analyticsLogPage,
  analyticsGroupUser,
  analyticsReset,
}
