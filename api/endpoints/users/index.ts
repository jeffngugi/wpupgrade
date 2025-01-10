import { User } from '../../specs/models/accessibles/user'
import { Spec } from '../../types/spec'

export type Users = Spec<{
  '/users': {
    resource: User[]
    includables: {}
    pathnameParams: {}
    methods: {
      GET?: {}
      POST: {
        attributes: {
          name: string
          time_zone: string
          phone?: string
          address?: string
          address2?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          collection_path?: string
        }
      }
    }
  }

  '/users/search': {
    resource: User[]
    includables: {}
    pathnameParams: {}
    methods: {
      GET?: {
        sort?: '-name' | 'name'
        term?: string
        attributes?: { state?: string }
      }
    }
  }
}>
