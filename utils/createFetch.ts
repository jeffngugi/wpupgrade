import Axios, { AxiosResponse, CancelToken, AxiosInstance } from 'axios'
import { MultiResponse, SingleResponse } from '../api'
import { ArrayElement } from '../utils'
import hashIt from 'hash-it'
import pathToRegExp, { Token, Key } from 'path-to-regexp'
import omit from 'lodash/omit'
import { AnyCache, SyncCache } from '../storage/cache'
import { HttpMethod } from './http'

export type GeneralSpecShape = {
  [x: string]: {
    resource: unknown
    includables: { [x: string]: unknown }
    pathnameParams: { [x: string]: unknown }
    methods: {
      [M in HttpMethod]?: any
    }
  }
}

type AnyMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD'

type Response<Data> = Data

export type BaseSpec = GeneralSpecShape

export function getRequestCacheKey({
  method,
  endpoint,
  params,
  recover,
}: {
  method: PropertyKey
  endpoint: PropertyKey
  params: unknown
  recover: undefined | ((maybeError: null) => null)
}) {
  return String(hashIt({ method, endpoint, params, recover }))
}

/**
 * Creates a type-safe fetch function given an API specification type
 * Type safety ensures that:
 *  * requested endpoint is valid
 *  * requested method is valid for the requested endpoint
 *  * request parameters are valid for that endpoint and method
 *  * response is fully typed
 */

type CreateFetchConfig = {
  /**
   * This cache will only be used to write responses to. The returned fetch function will
   * never read a cached response. It's up to the code providing this cache instance to
   * decide what to do with those cached responses. For example, it could check if it
   * already has a cached response and use it as a stale version while performing the
   * request for the updated version.
   */
  writeOnlyCaches?: Array<AnyCache<string, any>>

  /**
   * This cache is only used to de-duplicate simultaneous identical requests,
   * the result would be evicted from the cache as soon as the response
   * comes in (even on failure).
   *
   * This cache has nothing to do with HTTP caching.
   */
  deduplicationCache?: SyncCache<string, Promise<null | AxiosResponse<any>>>
}

export interface Fetch<Spec extends BaseSpec> {
  <
    Endpoint extends keyof Spec,
    Method extends AnyMethod & keyof Spec[Endpoint]['methods'],
    Resource = Method extends 'GET'
      ? Spec[Endpoint]['resource']
      : Spec[Endpoint]['resource'] extends MultiResponse<infer R>
      ? SingleResponse<ArrayElement<R>>
      : Spec[Endpoint]['resource'],
  >(
    method: Method,
    pathname: Endpoint,
    /** Params for GET, body for other methods */
    params: Spec[Endpoint]['methods'][Method],
    cancelToken?: CancelToken,
  ): Promise<Resource>

  <
    Endpoint extends keyof Spec,
    Method extends AnyMethod & keyof Spec[Endpoint]['methods'],
    Resource = Method extends 'GET'
      ? Spec[Endpoint]['resource']
      : Spec[Endpoint]['resource'] extends MultiResponse<infer R>
      ? SingleResponse<ArrayElement<R>>
      : Spec[Endpoint]['resource'],
  >(
    method: Method,
    pathname: Endpoint,
    /** Params for GET, body for other methods */
    params: Spec[Endpoint]['methods'][Method],
    cancelToken: CancelToken | undefined,
    recover: (maybeError: unknown) => null,
  ): Promise<Resource | null>
}

export function createFetch<Spec extends BaseSpec>(
  axiosInstanceOrBaseUrl: AxiosInstance | string,
  {
    writeOnlyCaches = [],
    deduplicationCache = new Map<string, Promise<null | AxiosResponse<any>>>(),
  }: CreateFetchConfig = {},
) {
  let axios: AxiosInstance
  if (typeof axiosInstanceOrBaseUrl === 'string') {
    axios = Axios.create({ baseURL: axiosInstanceOrBaseUrl })
  } else {
    axios = axiosInstanceOrBaseUrl
  }

  const fetch: Fetch<Spec> = async <
    Endpoint extends keyof Spec,
    Method extends AnyMethod & keyof Spec[Endpoint]['methods'],
    Resource = Method extends 'GET'
      ? Spec[Endpoint]['resource']
      : Spec[Endpoint]['resource'] extends MultiResponse<infer R>
      ? SingleResponse<ArrayElement<R>>
      : Spec[Endpoint]['resource'],
  >(
    method: Method,
    pathname: Endpoint,
    /** Params for GET, body for other methods */
    params: Spec[Endpoint]['methods'][Method],
    cancelToken?: CancelToken | undefined,
    recover?: (maybeError: unknown) => null,
  ) => {
    const axiosConfig = compileRequestConfig(method, pathname, params)
    const { url } = axiosConfig

    const hash = getRequestCacheKey({
      method,
      endpoint: url,
      params,
      recover,
    })

    let promise = deduplicationCache.get(hash)
    if (promise === undefined) {
      promise = axios
        .request({
          ...axiosConfig,
          cancelToken,
        })
        .catch(recover)

      deduplicationCache.set(hash, promise)
    }

    try {
      const result = (await promise) as null | AxiosResponse<Response<Resource>>
      const returnValue = result === null ? null : result.data
      for await (const writeOnlyCache of writeOnlyCaches) {
        await writeOnlyCache?.set(hash, returnValue)
      }

      return returnValue
    } finally {
      deduplicationCache.delete(hash)
    }
  }

  return fetch
}

export type FetchReturnType<
  Spec extends Record<
    string,
    { methods: unknown; resource: unknown; includables?: unknown }
  >,
  Method extends AnyMethod & keyof Spec[Endpoint]['methods'],
  Endpoint extends keyof Spec,
  IsRecoverable = false,
  Resource = Method extends 'GET'
    ? Spec[Endpoint]['resource']
    : Spec[Endpoint]['resource'] extends MultiResponse<infer R>
    ? SingleResponse<ArrayElement<R>>
    : Spec[Endpoint]['resource'],
> = IsRecoverable extends false ? Resource : Resource | null

function isTokenWithName(token: Token): token is Key {
  return typeof token !== 'string'
}

function compileRequestConfig<
  Spec extends BaseSpec,
  Endpoint extends keyof Spec,
  Method extends AnyMethod & keyof Spec[Endpoint]['methods'],
>(
  method: Method & AnyMethod,
  pathname: Endpoint,
  /** Params for GET, body for other methods */
  params: Spec[Endpoint]['methods'][Method],
) {
  const toPath = pathToRegExp.compile(String(pathname))
  const pathNameTokens = pathToRegExp.parse(String(pathname))
  const pathnameParamKeys = pathNameTokens
    .filter(isTokenWithName)
    .map(token => token.name)

  // @ts-ignore
  const url = toPath(params || {})

  // Remove pathname params from query e.g. `id` from `/item/:id`
  // This prevents duplicating params in URLs like `/item/1?id=1`
  const nonPathnameParams = omit(params as any, pathnameParamKeys)

  return {
    method,
    url,
    params: method === 'GET' ? nonPathnameParams : undefined,
    data: method === 'GET' ? undefined : nonPathnameParams,
  }
}
