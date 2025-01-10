import format from 'date-fns/format'
import { useTranslation } from 'react-i18next'

export const useSalutation = (name: string) => {
  const today = format(new Date(), 'eeee')
  const { t } = useTranslation('salutation')
  let salutation = t('default')
  let greetings = 'Happy ' + today + ','

  switch (today) {
    case 'Monday':
      salutation = t('monday')
      greetings = t('mondayGreetings', { name })
      break
    case 'Tuesday':
      salutation = t('tuesday')
      greetings = t('tuesdayGreetings')
      break
    case 'Wednesday':
      salutation = t('wednesday')
      greetings = t('wednesdayGreetings')
      break
    case 'Thursday':
      salutation = t('thursday')
      greetings = t('thursdayGreeting')
      break
    case 'Friday':
      salutation = t('friday')
      greetings = t('fridayGreetings')
      break
    case 'Saturday':
      greetings = t('weekendGreetings')
      break
    default:
      break
  }
  return { salutation, greetings }
}
