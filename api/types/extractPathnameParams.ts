export type PathParams<Path extends string> =
  Path extends `:${infer Param}/${infer Rest}`
    ? Param | PathParams<Rest>
    : Path extends `:${infer Param}\\${string}`
    ? Param
    : Path extends `:${infer Param}`
    ? Param
    : Path extends `${infer _Prefix}:${infer Rest}`
    ? PathParams<`:${Rest}`>
    : never
