import { isArray, isEmpty } from 'lodash'
import { createSelectOptionsTyped } from '~helpers'

export function getEmployeePaymentOptions(allPaymentMethods, processable) {
  if (isEmpty(allPaymentMethods) || !isArray(allPaymentMethods)) return []
  const methodsAbstraction = allPaymentMethods?.filter(
    option => option?.method === 'WALLET' || option?.method === 'BANK',
  )

  const methodAbstractionOptions = createSelectOptionsTyped(
    methodsAbstraction,
    'method',
    'method',
  )

  const momoProvidersC2C = [
    'MPESA',
    'MTN',
    'AIRTEL',
    'TIGO',
    'TELCOM',
    'TILL',
    'PAYBILL',
  ]

  // Checks whether a payment method is of mobile money
  const isMobileMoneyMethod = option =>
    momoProvidersC2C?.includes(option?.method)

  const nonProcessableOptions = [
    { value: 'CASH', label: 'Cash' },
    { value: 'CHEQUE', label: 'Cheque' },
  ]

  const paymentOptions = () => {
    if (allPaymentMethods?.some(isMobileMoneyMethod)) {
      if (!processable) {
        return [
          ...methodAbstractionOptions,
          { value: 'MOBILE_MONEY', label: 'Mobile money' },
          ...nonProcessableOptions,
        ]
      }
      return [
        ...methodAbstractionOptions,
        { value: 'MOBILE_MONEY', label: 'Mobile money' },
      ]
    }
    if (!processable) {
      return [...methodAbstractionOptions, ...nonProcessableOptions]
    }
    return methodAbstractionOptions
  }

  return paymentOptions()
}

export function getEmployeeMobilePaymentOptions(allPaymentMethods) {
  if (isEmpty(allPaymentMethods) || !isArray(allPaymentMethods)) return []
  const methodsAbstraction = allPaymentMethods?.filter(
    option => option?.method !== 'BANK' && option?.method !== 'WALLET',
  )

  const methodAbstractionOptions = createSelectOptionsTyped(
    methodsAbstraction,
    'method',
    'method',
  )

  return methodAbstractionOptions
}
