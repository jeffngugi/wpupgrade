import { ComponentProps } from 'react'
import { FormattedMessage } from 'react-intl'
import { ValueOf, Primitive, DeepPartial, DeepRequired } from 'ts-essentials'
import { SuccessState } from '../utils'
import { CamelCase, SnakeCase } from 'literal-case'
import { NonNever } from 'ts-essentials'
export type ArrayElement<T extends ArrayLike<any>> = T[number]

export type UnboxPromise<T> = T extends PromiseLike<infer R> ? R : T
export type Falsey = 0 | '' | false | null | undefined
export type Truthy<T> = Exclude<T, Falsey>

export type NonFalsey<T> = T extends Falsey ? never : T
export type AsyncReturnType<T extends () => any> = UnboxPromise<ReturnType<T>>
export type SuccessFetchState<T extends () => any> = SuccessState<
  AsyncReturnType<T>
>

export type IntlValue = ValueOf<
  NonNullable<ComponentProps<typeof FormattedMessage>['values']>
>

export type EntriesOf<T> = Array<[keyof T, ValueOf<T>]>
export type EntryOf<T> = ArrayElement<EntriesOf<T>>

export type MaybeLazy<T, Params extends any[] = []> =
  | T
  | ((...args: Params) => T)
export type MaybeLazyAsync<T, Params extends any[] = []> =
  | MaybeLazy<T, Params>
  | MaybeLazy<PromiseLike<T>, Params>

export type UnboxMaybeLazy<T> = T extends () => infer R ? R : T

export type UnboxMaybeLazyAsync<T> = UnboxPromise<UnboxMaybeLazy<T>>

/**
 * Takes a union of tuple types like `["a", string] | ["b", number]`
 * and turns them into an object type like this:
 * `{ a: string, b: number }`.
 *
 * @see https://stackoverflow.com/a/45375646
 */
export type KeyValueTupleToObject<T extends [PropertyKey, any]> = {
  [K in T[0]]: Extract<T, [K, any]>[1]
}

/**
 * Takes a type `SourceObject` and a key-mapping `KeyMapping` and substitutes any key in `SourceObject`
 * which is present in `KeyMapping` with the corresponding key from `KeyMapping`.
 * If a key in `SourceObject` is not present in `KeyMapping`, the key is not transformed.
 * If a key in `KeyMapping` is not present in `SourceObject`, it will be ignored.
 *
 * @see https://stackoverflow.com/a/45375646
 */
export type MapKeys<
  SourceObject,
  KeyMapping extends Record<string, string>,
> = KeyValueTupleToObject<
  ValueOf<{
    [K in keyof SourceObject]: [
      K extends keyof KeyMapping ? KeyMapping[K] : K,
      SourceObject[K],
    ]
  }>
>

export type ToCamelCase<T extends string> = CamelCase<T>

type CamelCaseKeys<SourceObject extends Record<string, any>> =
  KeyValueTupleToObject<
    ValueOf<{
      [K in keyof SourceObject]: [
        K extends string ? CamelCase<K> : never,
        SourceObject[K],
      ]
    }>
  >

type DecamelCaseKeys<SourceObject extends Record<string, any>> =
  KeyValueTupleToObject<
    ValueOf<{
      [K in keyof SourceObject]: [
        K extends string ? SnakeCase<K> : never,
        SourceObject[K],
      ]
    }>
  >

export type DeepCamelCaseKeys<T> = CamelCaseKeys<{
  [K in keyof T]: T[K] extends Primitive ? T[K] : DeepCamelCaseKeys<T[K]>
}>

export type DeepDecamelCaseKeys<T> = DecamelCaseKeys<{
  [K in keyof T]: T[K] extends Primitive ? T[K] : DeepDecamelCaseKeys<T[K]>
}>

export type ImmutableCamelCased<T> = Immutable<DeepCamelCaseKeys<T>>

export type ImmutableMap<T> = {
  get<K extends keyof T>(
    key: K,
  ): T[K] extends Primitive ? T[K] : ImmutableMap<T[K]>
  set<K extends keyof T>(key: K, value: T[K]): ImmutableMap<T>
  delete<K extends keyof T>(key: K): ImmutableMap<T>
  reduce<K extends KeyOfPossiblyImmutable<T>>(
    reduceFn: (
      accumulator: ImmutableMap<T>,
      value: ImmutableMap<T[K]>,
      key: K,
    ) => ImmutableMap<T>,
    accumulator?: ImmutableMap<T>,
  ): ImmutableMap<T>
  withMutations(mutator: (obj: ImmutableMap<T>) => void): ImmutableMap<T>
  mergeDeep(patch: DeepPartial<T>): ImmutableMap<T>
  merge(patch: Partial<T>): ImmutableMap<T>
  toJS(): NonImmutable<T>
  equals(other: ImmutableMap<T>): boolean
}

export type Split<T extends string> = T extends `${infer S}.${infer R}`
  ? [S, ...Split<R>]
  : T extends `.${infer E}`
  ? [E]
  : [T]

export type NestedPath<D> = D extends { [x: string]: any }
  ? ValueOf<{
      [K in keyof D]: [K, ...NestedPath<D[K]>]
    }>
  : []

export type Join<T extends any[]> = T extends [infer First, infer Last]
  ? `${First & string}.${Last & string}`
  : T extends [infer First, ...infer Rest, infer Last]
  ? `${First & string}.${Join<Rest>}.${Last & string}`
  : T extends [infer First]
  ? `${First & string}`
  : ``

export type DeepPick<T, Path extends string> = T extends Primitive
  ? T
  : ValueOf<
      NonNever<{
        [K in keyof T]: Split<Path> extends [K]
          ? T[K]
          : Split<Path> extends [K, ...NestedPath<T[K]>]
          ? DeepPick<T[K], Join<NestedPath<T[K]>>>
          : never
      }>
    >

export type Immutable<T extends {}> = {
  [K in keyof T]: T[K] extends Primitive ? T[K] : Immutable<T[K]>
} & {
  get<K extends keyof T>(
    key: K,
  ): T[K] extends Primitive ? T[K] : Immutable<T[K]>
  getIn<Path extends NestedPath<T>>(
    path: Path,
  ): DeepPick<DeepRequired<T>, Join<Path>> | undefined
  getIn<Path extends NestedPath<T>, Fallback = undefined>(
    path: Path,
    fallback: Fallback,
  ): DeepPick<DeepRequired<T>, Join<Path>> | Fallback
  set<K extends keyof T>(key: K, value: T[K]): Immutable<T>
  delete<K extends keyof T>(key: K): Immutable<T>
  reduce<K extends KeyOfPossiblyImmutable<T>>(
    reduceFn: (
      accumulator: Immutable<T>,
      value: Immutable<T[K]>,
      key: K,
    ) => Immutable<T>,
    accumulator?: Immutable<T>,
  ): Immutable<T>
  withMutations(mutator: (obj: Immutable<T>) => void): Immutable<T>
  mergeDeep(patch: DeepPartial<T>): Immutable<T>
  merge(patch: Partial<T>): Immutable<T>
  toMap(): ImmutableMap<T>
  toJS(): DeepNonImmutable<T>
  equals(other: ImmutableMap<T> | Immutable<T>): boolean
}

export type NonImmutable<T> = T extends Immutable<infer R> ? R : T

export type MaybeImmutable<T> = T | Immutable<T>

type DeepNonImmutable<T> = T extends Primitive
  ? T
  : {
      [K in keyof T]: T[K] extends Primitive ? T[K] : NonImmutable<T[K]>
    }

export type KeyOfPossiblyImmutable<T> = T extends Immutable<infer R>
  ? keyof R
  : keyof T
