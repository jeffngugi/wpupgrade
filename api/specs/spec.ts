import {
  ApiResource,
  ApiType,
  ExtendedSpec,
  PaginatedEndpoint,
  PaginatedSpec,
  MultiResource,
  ResourceOfType,
} from '../types/spec'
import { Users } from '../endpoints/users'
import { AllModels } from './models/allModels'

export type WorkpayApiSpec = ExtendedSpec<Users>

export type WorkpayApiResource = ApiResource<WorkpayApiSpec>

export type WorkpayResourceOfType<
  T extends AllModels['type'],
  Includables = {},
> = ResourceOfType<AllModels, T, Includables>
export type WorkpayApiType = ApiType<WorkpayApiSpec> & AllModels['type']
export type WorkpayPaginatedEndpoint = PaginatedEndpoint<WorkpayApiSpec>

export type WorkpayPaginatedApiSpec = PaginatedSpec<WorkpayApiSpec>

export type WorkpayMultiResource<
  Endpoint extends keyof WorkpayPaginatedApiSpec = keyof WorkpayPaginatedApiSpec,
> = MultiResource<Endpoint, WorkpayApiSpec, WorkpayPaginatedApiSpec>
