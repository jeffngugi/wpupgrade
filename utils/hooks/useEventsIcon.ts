import { SvgProps } from 'react-native-svg'
import AnniversaryIcon from '~assets/svg/anniversary-icon.svg'
import BirthdayIcon from '~assets/svg/birthday.svg'
import ContactExpiry from '~assets/svg/contact-expiry.svg'
import HolidayIcon from '~assets/svg/holiday.svg'
import ProbationIcon from '~assets/svg/probation-end.svg'

export type Tevent =
  | 'Holiday'
  | 'Birthday'
  | 'Anniversary'
  | 'Contract Expiry'
  | 'Probation End'
  | string

export function useEventsIcon(event: Tevent): React.FC<SvgProps> {
  let Icon = AnniversaryIcon
  switch (event) {
    case 'Holiday':
      Icon = HolidayIcon
      break
    case 'Birthday':
      Icon = BirthdayIcon
      break
    case 'Anniversary':
      Icon = AnniversaryIcon
      break
    case 'Contract Expiry':
      Icon = ContactExpiry
      break
    case 'Probation End':
      Icon = ProbationIcon
      break
    default:
      break
  }
  return Icon
}
