import { GeneralSpecShape } from '../../utils'
import { Resource } from './resource'
import { MultiResponse, SingleResponse, Response } from './response'
import { NonEmptyObject, NonNever, ValueOf } from 'ts-essentials'
import { PathParams } from './extractPathnameParams'

type ArrayOrSingle<T> = T | T[]

type NormalizeResource<
  Entry extends GeneralSpecShape[keyof GeneralSpecShape],
  R = Entry['resource'],
> = R extends ArrayOrSingle<Resource<string, unknown, unknown>>
  ? Omit<Entry, 'resource' | 'methods'> & {
      resource: Response<R>
      methods: {
        [M in keyof Entry['methods']]: WithIncludesParams<
          Entry['includables'],
          M extends 'GET'
            ? PaginatedParams<R, Entry['methods'][M]>
            : Entry['methods'][M]
        >
      }
    }
  : Entry

export type ExtendedSpec<BaseSpec extends GeneralSpecShape> = {
  [Endpoint in keyof BaseSpec]: WithPathnameParams<
    NormalizeResource<BaseSpec[Endpoint]>
  >
}

export type Spec<
  S extends GeneralSpecShape & {
    [E in Endpoint]: Omit<S[E], 'pathnameParams'> & {
      pathnameParams: {
        [Param in PathParams<E>]: unknown
      }
    }
  },
  Endpoint extends string & keyof S = keyof S & string,
> = S

type WithIncludesParams<Includables extends {}, Params> = Params & {
  includes?: ArrayLike<keyof Includables>
}

type WithPathnameParams<
  Entry extends GeneralSpecShape[keyof GeneralSpecShape],
> = Omit<Entry, 'methods'> & {
  methods: {
    [M in keyof Entry['methods']]-?: CombineWithUndefined<
      Entry['methods'][M],
      Entry['pathnameParams']
    >
  }
}

export type CombineWithUndefined<MaybeUndefined, Other> = NonNullable<
  MaybeUndefined extends undefined ? Other : MaybeUndefined & Other
>

export type PageParams = {
  /**
   * Minimum: 1, Maximum: value of `total_pages` from `meta`
   * @default 1
   */
  page?: number

  /**
   * Default: 25, Minimum: 1, Maximum: 50
   * @default 25
   */
  per_page?: number
}

export type PaginatedParams<R, T> = R extends unknown[] ? PageParams & T : T

export type PaginatedSpec<BaseSpec extends GeneralSpecShape> = NonNever<{
  [K in keyof BaseSpec]: BaseSpec[K]['resource'] extends MultiResponse<any>
    ? BaseSpec[K]
    : never
}>

export type PaginatedEndpoint<BaseSpec extends GeneralSpecShape> =
  keyof PaginatedSpec<BaseSpec>

/**
 * A way to access a paginated resource via its endpoint
 * @example MultiResource<'/search'> === Searchable
 */
export type MultiResource<
  R extends keyof Spec,
  BaseSpec extends GeneralSpecShape,
  Spec extends PaginatedSpec<BaseSpec> = PaginatedSpec<BaseSpec>,
> = ValueOf<
  NonNever<{
    [K in R]: Spec[K]['resource'] extends MultiResponse<Array<infer T>>
      ? T
      : never
  }>
>

export type EndpointToEndpointMap<BaseSpec extends GeneralSpecShape> = {
  [Endpoint in PaginatedEndpoint<BaseSpec>]?: Exclude<
    PaginatedEndpoint<BaseSpec>,
    Endpoint
  >
}

export type ApiResources<BaseSpec extends GeneralSpecShape> = NonNever<{
  [K in keyof BaseSpec]: ExtractResourceFromResponse<BaseSpec[K]['resource']>
}>

export type ExtractResourceFromResponse<T> = T extends SingleResponse<
  Resource<infer Type, infer Attrs, infer Includables>
>
  ? Resource<Type, Attrs, Includables>
  : T extends MultiResponse<
      Array<Resource<infer Type, infer Attrs, infer Includables>>
    >
  ? Resource<Type, Attrs, Includables>
  : never

export type ApiResourcesOfType<
  BaseSpec extends GeneralSpecShape,
  TypeConstraint extends ApiResource<BaseSpec>['type'],
> = NonNever<{
  [K in keyof BaseSpec]: BaseSpec[K]['resource'] extends SingleResponse<
    Resource<TypeConstraint, infer Attrs, infer Includables>
  >
    ? Resource<TypeConstraint, Attrs, Includables>
    : BaseSpec[K]['resource'] extends MultiResponse<
        Array<Resource<TypeConstraint, infer Attrs, infer Includables>>
      >
    ? Resource<TypeConstraint, Attrs, Includables>
    : never
}>

export type ApiResourceOfType<
  BaseSpec extends GeneralSpecShape,
  TypeConstraint extends string,
> = ValueOf<ApiResourcesOfType<BaseSpec, TypeConstraint>>

export type ApiResource<BaseSpec extends GeneralSpecShape> = ValueOf<
  ApiResources<BaseSpec>
>

export type ApiType<BaseSpec extends GeneralSpecShape> =
  ApiResource<BaseSpec>['type']

export type ResourcesByType<
  AllModels extends { type: string; attributes: unknown },
> = NonNever<{
  [Type in AllModels['type']]: Extract<AllModels, { type: Type }>
}>

export type ExtractEndpointsWithRequiredParams<
  BaseSpec extends GeneralSpecShape,
> = {
  [Endpoint in keyof BaseSpec]: Omit<BaseSpec[Endpoint], 'methods'> & {
    methods: NonNever<{
      [K in keyof BaseSpec[Endpoint]['methods']]-?: BaseSpec[Endpoint]['methods'][K] extends undefined
        ? never
        : NonEmptyObject<BaseSpec[Endpoint]['methods'][K]>
    }>
  }
}

export type ResourceOfType<
  AllModels extends { type: string; attributes: unknown },
  Type extends keyof ResourcesByType<AllModels>,
  Includables = {},
> = Resource<
  ResourcesByType<AllModels>[Type]['type'],
  ResourcesByType<AllModels>[Type]['attributes'],
  Includables
>
