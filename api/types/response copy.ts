export type Meta = {
  page: number
  per_page: number
  total_count: number
  total_pages: number
}

export type MultiResponse<R extends ArrayLike<unknown>> = {
  data: R
  meta: Meta
}

export type SingleResponse<R> = {
  data: R
}

export type Response<R> = R extends ArrayLike<infer Single>
  ? MultiResponse<Single[]>
  : SingleResponse<R>

export type ResponseError<R extends { attributes: unknown }> = Readonly<{
  errors: Array<{
    attribute: null | keyof R['attributes']
    full_messages: string[]
    messages: string[]
  }>
}>
