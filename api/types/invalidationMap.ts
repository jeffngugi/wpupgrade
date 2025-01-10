export type InvalidationMap<ApiSpec> = {
  [K in keyof ApiSpec]?: Array<Exclude<keyof ApiSpec, K>>
}
