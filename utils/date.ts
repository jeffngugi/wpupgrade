import {
  format as formatFns,
  parseISO as FNSParseISO,
  isValid,
  parse as FNSParse,
  isSameDay,
  format,
} from 'date-fns'

export type DateOrISO = Date | string

export type DateFormat =
  | 'dayMonth'
  | 'monthday'
  | 'shortMonth'
  | 'weekday'
  | 'year'
  | 'monthYear'
  | 'do MMMM'
  | 'backend'

export const parseISO = (date: DateOrISO) =>
  date instanceof Date ? date : FNSParseISO(date)

export const dateToString = (
  date: DateOrISO,
  dateFormat: string,
): string | null => {
  if (!date || typeof date === 'undefined') {
    return null
  }
  const parsedDate = parseISO(date)
  if (!isValid(parsedDate)) {
    return null
  }
  return formatFns(parsedDate, dateFormat) // Return formatted date string
}

export function formatDate(date: DateOrISO, dateFormat: DateFormat) {
  try {
    const wpFormat = (dateFormat: string) =>
      formatFns(parseISO(date), dateFormat)

    const currentFormat = dateFormat

    switch (currentFormat) {
      case 'shortMonth':
        return wpFormat('d MMM y')
      case 'monthYear':
        return wpFormat('d MMMM')
      case 'dayMonth':
        return wpFormat('do, MMMM')
      case 'monthday':
        return wpFormat('MMMM, do')
      case 'weekday':
        return wpFormat('cccc')
      case 'backend':
        return wpFormat('yyyy-MM-dd')
      default:
        return wpFormat('do MMM, yyyy p')
    }
  } catch (e) {
    console.log('error', e)
    return ''
  }
}

export const fromBackedDate = (backendDate: DateOrISO, time?: boolean) => {
  if (backendDate instanceof Date) {
    return backendDate
  }
  try {
    const bDate = backendDate.split(' ')[0]
    const bTime = backendDate.split(' ')[1]
    if (time) {
      return isValid(parseISO(bTime))
        ? FNSParse(bTime, 'HH:mm:ss', new Date())
        : undefined
    } else {
      return isValid(parseISO(bDate)) ? parseISO(bDate) : undefined
    }
  } catch (error) {
    return undefined
  }
}

export const formatFromWPDate = (beDate: string) => {
  const date = FNSParse(beDate, 'yyyy-MM-dd HH:mm:ss', new Date())
  return isValid(date) ? date : undefined
}

export const getISODateString = (date: DateOrISO): string =>
  dateToString(date, 'yyyy-MM-dd')

export const isToday = (date: DateOrISO): boolean => {
  const parsedDate = parseISO(date)
  return isSameDay(parsedDate, new Date())
}

/**
 * This utility is used to format dates from the backend that are strings.
 * @param {string | null} date - the date string to format
 * @param {string | undefined} formatString - the date format string to use (optional)
 * @returns {string | null} the formatted date string if date is valid, null otherwise
 */
export const dateFormatter = (
  date: string | null,
  formatString?: string,
): string | null => {
  if (date) {
    const parsedDate = parseISO(date)
    const parsedDateIsValid = isValid(parsedDate)
    return parsedDateIsValid
      ? format(parsedDate, formatString || dayMonthYearTimeFormat)
      : null
  }
  return null
}

export const getHowLongAgo = (date: DateOrISO): string => {
  const parsedDate = parseISO(date)
  const parsedDateIsValid = isValid(parsedDate)
  if (parsedDateIsValid) {
    const now = new Date()
    const diff = now.getTime() - parsedDate.getTime()
    const diffInDays = diff / (1000 * 3600 * 24)
    const diffInHours = diff / (1000 * 3600)
    const diffInMinutes = diff / (1000 * 60)
    const diffInSeconds = diff / 1000
    if (diffInDays > 1) {
      return `${Math.floor(diffInDays)} days ago`
    } else if (diffInHours > 1) {
      return `${Math.floor(diffInHours)} hours ago`
    } else if (diffInMinutes > 1) {
      return `${Math.floor(diffInMinutes)} minutes ago`
    } else {
      return `${Math.floor(diffInSeconds)} seconds ago`
    }
  }
  return ''
}

export const dayMonthYearFormat = 'do MMM yyyy'
export const dayMonthYearTimeFormat = 'do MMM yyyy, p'
export const monthDayShortFormFormat = 'MMM dd'
