import { Linking } from 'react-native'
import { isAndroid } from './platforms'

const keyStr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

const BASE64 = {
  encode: function (input) {
    const output = []
    let chr1,
      chr2,
      chr3 = ''
    let enc1,
      enc2,
      enc3,
      enc4 = ''
    let i = 0

    do {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)

      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63

      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }

      output.push(
        keyStr.charAt(enc1) +
          keyStr.charAt(enc2) +
          keyStr.charAt(enc3) +
          keyStr.charAt(enc4),
      )
      chr1 = chr2 = chr3 = ''
      enc1 = enc2 = enc3 = enc4 = ''
    } while (i < input.length)

    return output.join('')
  },
}

const DEPRECATED_PIN = [
  '0000',
  '1111',
  '2222',
  '3333',
  '4444',
  '5555',
  '6666',
  '7777',
  '8888',
  '9999',
  '1234',
  '4321',
]

export function isPinValid(pin: string) {
  return /^\d{6}$/.test(pin) && !DEPRECATED_PIN.includes(pin)
}

type CONVERT_OPTIONS = {
  minimumFractionDigits: number
  style?: 'currency' | 'decimal'
  currency?: string
}

export const currencyFormatter = (
  num: string | number | undefined,
  currency?: string | undefined | null,
) => {
  const number = num || 0
  const CONVERT_OPTIONS: CONVERT_OPTIONS = {
    minimumFractionDigits: 2,
  }
  if (currency) {
    CONVERT_OPTIONS['style'] = 'currency'
    CONVERT_OPTIONS['currency'] = currency
  }

  const actualNumber = +number?.toString()?.replace(/,/g, '')
  return actualNumber.toLocaleString('en-US', CONVERT_OPTIONS)
}

export const openDialPad = (phone: string) => {
  let phoneNumber = phone
  if (!isAndroid) {
    phoneNumber = `telprompt:${phone}`
  } else {
    phoneNumber = `tel:${phone}`
  }
  Linking.openURL(phoneNumber).catch(err => console.log(err))
}

export const hiddenAmount = (formattedAmount: string) => {
  const noOfStarsToDisplay: number = formattedAmount
    ? formattedAmount?.length
    : 3
  return '*'.repeat(noOfStarsToDisplay)
}

export { BASE64 }
