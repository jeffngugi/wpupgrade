import { isEmpty, isNumber, isNil } from 'lodash'
import { Buffer } from 'buffer'

export function currencyDisplayFormatter(value: string) {
  if (isNil(value)) return '-'
  try {
    let amount: string = '' + value
    let isSigned = false
    if (amount.includes('-')) {
      isSigned = true
      amount = amount.replace('-', '')
    }
    const amountArray: Array<string> = amount.split('.')
    const lhs = amountArray[0]
    const editedLHS: Array<string> = []
    const startArt = lhs.length - 1
    let count = 0
    for (let i = startArt; i > -1; i--) {
      editedLHS.unshift(lhs[i])
      count++
      if (count % 3 === 0 && i - 1 >= 0) {
        editedLHS.unshift(',')
      }
    }
    let editedLHSString = ''
    for (const item of editedLHS) {
      editedLHSString += item
    }
    !isNumber(amountArray[1]) && (amountArray[1] = '00')
    let rhsTwoDp = amountArray[1].substring(0, 2)
    rhsTwoDp.length < 2 && (rhsTwoDp += '0')
    amount = editedLHSString + '.' + rhsTwoDp
    isSigned && (amount = '-' + amount)
    return amount
  } catch (err) {
    return '0'
  }
}

export function currencyWithCode(currency: string, amount: string) {
  const empCurrency = !isEmpty(currency) ? currency + '.' : ''
  const amnt = `${empCurrency} ${currencyDisplayFormatter(amount)}`
  return amnt
}

export const getFormData = (requestParameters = {}) => {
  const formData = new FormData()

  Object.keys(requestParameters).map(key => {
    const value = requestParameters[key]

    if (Array.isArray(value)) {
      value.map((val, idx) => {
        formData.append(`${key}[${idx}]`, val)
        return null
      })
    } else {
      formData.append(key, value)
    }
    return null
  })
  return formData
}
export function randomId(length: number) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function WPBTOA(str: string | number | undefined) {
  if (arguments.length !== 1 || !str) {
    throw new TypeError(
      ` WPATOB requires 1 argument of type String, but ${arguments.length} present`,
    )
  }
  const value = str.toString()
  return Buffer.from(value, 'binary').toString('base64')
}

export const formatPhoneNumber = (number: string, countryCode: string) => {
  if (number.startsWith(countryCode)) {
    return number.replace(countryCode, '')
  }
  return number
}

export const getFirstCharacters = (sentence: string) => {
  return sentence
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
}
