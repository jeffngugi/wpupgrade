import { TimeZoneString } from '../../../types/dateTime'
import { Resource } from '../../../types/resource'

export type User = Resource<
  'user',
  {
    name: string
    phone: string | null
    address: string | null
    address2: string | null
    city: string | null
    state: string | null
    postal_code: string | null
    country: string | null
    time_zone: TimeZoneString
  }
>
