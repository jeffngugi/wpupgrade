import _ from 'lodash'
import { Bank, BankBranch, BankBranchOption } from '~screens/expenses/types'
import store from '~store'
import { isArray, isEmpty } from "lodash";

export function createSelectOptions(
  data = [],
  value: null | undefined | string = null,
  label: null | undefined | string = null,
) {
  // data is an array of objects of the options you have
  // value is the key of what you want as option in your data set and the same applies for label
  if (Array.isArray(data)) {
    const options = data.map(option => ({
      value: option[value || 'id'],
      label: option[label || 'name'],
      flag: option.flag,
      data: option,
      allData: data,
    }))
    return options
  }
  return []
}

export function createSelectOptionsTyped<T>(
  data: T[],
  value: keyof T,
  label: keyof T,
) {
  if (Array.isArray(data)) {
    const options = data.map(option => ({
      value: option[value],
      label: option[label],
      data: option,
    }))
    return options
  }
  return []
}

export function createExpenseSelectOptions(
  data = [],
  value = null,
  label = null,
) {
  // data is an array of objects of the options you have
  // value is the key of what you want as option in your data set and the same applies for label
  if (Array.isArray(data)) {
    let options: any[] = []

    data.forEach(option => {
      const subCategoryOptions: SubCategoryOption[] = option.sub_categories.map(
        (subCategory: any) => ({
          value: subCategory[value || 'id'],
          label: subCategory[label || 'name'],
          parent: option[value || 'id'],
        }),
      )

      options = options.concat(subCategoryOptions)

      options.push({
        value: option[value || 'id'],
        label: option[label || 'name'],
        subCategoryOptions: subCategoryOptions.length
          ? subCategoryOptions
          : undefined,
      })
    })

    return options
  }
}

export type SubCategoryOption = {
  value: string
  label: string
  parent: string
}

export function createExpenseSelectOptionsTyped<
  T extends Record<string, any>,
  U extends Record<string, any>
>(
  data: T[],
  value: keyof T,
  label: keyof T,
  subCategoriesKey: keyof T, // To dynamically access sub_categories key
): Array<{ value: any; label: any; subCategoryOptions?: SubCategoryOption[] }> {
  if (Array.isArray(data)) {
    let options: Array<{ value: any; label: any; subCategoryOptions?: SubCategoryOption[] }> = []

    data.forEach(option => {
      // Dynamically access the subCategories array
      const subCategories = option[subCategoriesKey] as U[]
      const subCategoryOptions: SubCategoryOption[] = subCategories?.map(
        (subCategory: U) => ({
          value: subCategory[value as keyof U],
          label: subCategory[label as keyof U],
          parent: option[value],
        }),
      ) || []

      options.push({
        value: option[value],
        label: option[label],
        subCategoryOptions: subCategoryOptions.length ? subCategoryOptions : undefined,
      })
    })

    return options
  }

  return []
}



export function oneItemIsNullish(...args) {
  if (args?.length < 1) {
    throw new TypeError(
      ` oneItemIsNullish requires at least 1 argument, but ${arguments.length} present`,
    )
  }

  const hasNullishItem = args.some(item => _.isNull(item))
  return hasNullishItem
}

export const useCurrentCompany = () => {
  const {
    user: { user },
  } = store.getState()

  const companiesV2 = useCompaniesV2({ recordsPerPage: 200 })

  const V2Company = companiesV2?.data?.data?.data

  const currentCompanyV2 = V2Company?.filter(
    company => company.id === user.company_id,
  )

  const currentCompany = currentCompanyV2?.[0] || {}

  const inKenya = currentCompany?.country?.alpha_two_code === 'KE'

  const currencyCode = currentCompany?.currency_code || ''

  return {
    currentCompany,
    inKenya,
    currencyCode,
    companiesV2,
    allCompanies: V2Company,
    isLoading: companiesV2.isLoading,
  }
}
export function createCurrencySelectOptions(
  data = [],
  value = null,
  label = null,
) {
  if (Array.isArray(data)) {
    const options = data.map((option: object) => ({
      value: option[value || 'id'],
      label: option[label || 'name'],
      ...option,
    }))
    return options
  }
  return []
}

export function createCurrencySelectOptionsTyped<T>(
  data: T[],
  value: keyof T,
  label: keyof T,
  code: keyof T,
) {
  if (Array.isArray(data)) {
    const options = data.map(option => ({
      value: option[value],
      label: option[label],
      code: option[code],
      ...option,
    }))
    return options
  }
  return []
}


export const getBankOptions = (banks: Bank[]) => {
  type BankOptions = {
    value: string
    label: string
    branches: BankBranchOption[]
  }[]
  let bankOptionsList: BankOptions = []
  if (banks.length > 0) {
    bankOptionsList = banks?.map(option => ({
      value: option.id,
      label: option.name,
      branches: createSelectOptionsTyped<BankBranch>(option?.branches, 'id', 'name',),
    }))
  }
  return bankOptionsList
}


export function getFileNameFromUrl(url: string) {
  const fileName = url?.match(/[^/]*$/)?.[0] ?? ''
  return fileName
}

export function getEmployeePaymentOptions(allPaymentMethods, processable) {
  if (isEmpty(allPaymentMethods) || !isArray(allPaymentMethods)) return [];
  const methodsAbstraction = allPaymentMethods?.filter(
    option => option?.method === 'BANK',
  );

  const methodAbstractionOptions = createSelectOptionsTyped(
    methodsAbstraction,
    'method',
    'method',
  );

  const momoProvidersC2C = [
    'MPESA',
    'MTN',
    'AIRTEL',
    'TIGO',
    'TELCOM',
    'TILL',
    'PAYBILL',
  ];

  // Checks whether a payment method is of mobile money
  const isMobileMoneyMethod = option =>
    momoProvidersC2C?.includes(option?.method);

  const nonProcessableOptions = [
    { value: 'CASH', label: 'Cash' },
    { value: 'CHEQUE', label: 'Cheque' },
  ];

  const paymentOptions = () => {
    if (allPaymentMethods?.some(isMobileMoneyMethod)) {
      if (!processable) {
        return [
          ...methodAbstractionOptions,
          { value: 'MOBILE_MONEY', label: 'Mobile money' },
          ...nonProcessableOptions,
        ];
      }
      return [
        ...methodAbstractionOptions,
        { value: 'MOBILE_MONEY', label: 'Mobile money' },
      ];
    }
    if (!processable) {
      return [...methodAbstractionOptions, ...nonProcessableOptions];
    }
    return methodAbstractionOptions;
  }

  return paymentOptions();
}

export function getEmployeeMobilePaymentOptions(allPaymentMethods) {
  if (isEmpty(allPaymentMethods) || !isArray(allPaymentMethods)) return [];
  const methodsAbstraction = allPaymentMethods?.filter(
    option => option?.method !== 'BANK',
  );

  const methodAbstractionOptions = createSelectOptionsTyped(
    methodsAbstraction,
    'method',
    'method',
  );

  return methodAbstractionOptions;
}

