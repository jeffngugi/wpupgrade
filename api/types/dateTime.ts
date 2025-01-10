import { User } from './shared'

export type InstantString = User<string, 'instant'>

/**
 * A string of the form `YYYY-MM-DDTHH:mm:ss` with no timezone or time
 * offset associated.
 */
export type CivilDateTimeString = User<string, 'civil_date_time'>

export type CivilTimeString = User<`${string}:${string}`, 'civil_time'>

export type TimeZoneString = User<string, 'time_zone'>
