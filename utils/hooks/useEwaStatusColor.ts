import { capitalize } from 'lodash'
import { ColorType } from 'native-base/lib/typescript/components/types'

export const useEwaStatusColor = (status: string): ColorType => {
  switch (capitalize(status)) {
    case 'Failed':
      return '#F14B3B'
    case 'Successful':
      return '#62A446'
    case 'Pending':
      return '#F3B744'
    case 'Processing':
      return '#F3B744'
    default:
      return '#536171'
  }
}

export const useWalletStatusColor = (status: string): ColorType => {
  switch (capitalize(status)) {
    case 'Failed':
      return '#F14B3B'
    case 'Success':
      return '#D6F1CA'
    case 'Pending':
      return '#F3B744'
    case 'Processing':
      return '#F3B744'
    default:
      return '#536171'
  }
}
