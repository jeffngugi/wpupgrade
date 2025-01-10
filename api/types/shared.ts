import { Opaque } from 'ts-essentials'

/**
 * A hack to simulate an "opaque" type in TS
 * @see https://flow.org/en/docs/types/opaque-types/
 *
 */
export type User<T, B extends string> = Opaque<T, B>
