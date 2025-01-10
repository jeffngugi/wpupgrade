import { SvgProps } from 'react-native-svg'
import LeaveIcon from '~assets/svg/leaves.svg'
import ExpenseIcon from '~assets/svg/expenses.svg'
import EwaIcon from '~assets/svg/ewa.svg'
import LoansIcon from '~assets/svg/loan.svg'
import PayslipsIcon from '~assets/svg/payslip.svg'
import DocumentsIcon from '~assets/svg/documents.svg'
import AssetsIcon from '~assets/svg/assets.svg'
import PeopleIcon from '~assets/svg/peoples.svg'
import OvertimeIcon from '~assets/svg/overtime.svg'
import TAIcon from '~assets/svg/t-a.svg'
import AdvanceIcon from '~assets/svg/salary-advance.svg'
import {
  EwaRoutes,
  PayslipRoutes,
  PeopleRoutes,
  OvertimeRoutes,
  DocumentRoutes,
  LeaveRoutes,
  ExpenseRoutes,
  LoanRoutes,
  AssetRoutes,
  AdvanceRoutes,
  TARoutes,
  AdvanceLoanRoutes,
  LeaveRoutesRedesign,
  ExpenseRoutesRedesign,
} from '~types'

import { TEnabledFeatures } from '~screens/menu/enabledFeatures'
import { useAccountSettings, useEnabledFeatures } from '~api/settings'
import { useSalaryAdvanceLoanSettings } from '~api/advance-loans'
import { getEmployeeParams } from '~helpers/authHelper'
import { useTranslation } from 'react-i18next'

export type TMenuItem = {
  name: string
  description: string
  Icon: React.FC<SvgProps>
  new?: boolean
  route: string | null
  quickAccess: number
  label: string
}

export function isFeatureEnabled(
  val: string,
  enabledFeatures: TEnabledFeatures[],
): boolean {
  if (enabledFeatures?.length < 1) {
    return false
  }
  return enabledFeatures?.some(function (arrVal) {
    return val === arrVal.feature_code
  })
}

export function addConditionally(check: boolean, ...menuItems: TMenuItem[]) {
  return check ? menuItems : []
}

export function useMenuItems() {
  const { t } = useTranslation('menu')
  const { data: settingData } = useAccountSettings()
  const allowPayslip = Boolean(settingData?.data?.allow_payslip_download)
  const { data } = useEnabledFeatures()
  const { data: data2 } = useAccountSettings()
  const accountSettings = data2?.data
  const enabledFeatures = data?.data?.data ?? []

  const salaryAdvanceParams = {
    ...getEmployeeParams(),
    ...{ type: 'salary_advance' },
  }
  const useCompanySalaryAdvance =
    useSalaryAdvanceLoanSettings(salaryAdvanceParams)

  const salaryAdvanceLoanSettings =
    useCompanySalaryAdvance?.data?.data?.settings?.data?.[0]

  const isWRKPYEnabled = salaryAdvanceLoanSettings?.workpay_type_enabled
  const taAvailable =
    isFeatureEnabled('attendance-general', enabledFeatures) ||
    isFeatureEnabled('attendance-general', enabledFeatures) ||
    isFeatureEnabled('attendance-general', enabledFeatures)



  const menuItems = [
    ...addConditionally(isFeatureEnabled('leaves', enabledFeatures), {
      name: t('leave.name'),
      description: t('leave.description'),
      Icon: LeaveIcon,
      route: isFeatureEnabled('leave_design_revamp', enabledFeatures)
        ? LeaveRoutesRedesign.Leave
        : LeaveRoutes.Leave,
      quickAccess: 1,
      label: t('leave.label'),
    }),

    ...addConditionally(isFeatureEnabled('expenses', enabledFeatures), {
      name: t('expenses.name'),
      description: t('expenses.description'),
      Icon: ExpenseIcon,
      route: isFeatureEnabled('expenses_redesign', enabledFeatures)
        ? ExpenseRoutesRedesign.Expense
        : ExpenseRoutes.Expense,
      quickAccess: 3,
      label: t('expenses.label'),
    }),

    ...addConditionally(isFeatureEnabled('ewa', enabledFeatures), {
      name: t('ewa.name'),
      description: t('ewa.description'),
      Icon: EwaIcon,
      route: EwaRoutes.Ewa,
      quickAccess: 4,
      label: t('ewa.label'),
    }),

    ...addConditionally(isFeatureEnabled('loans', enabledFeatures), {
      name: t('loans.name'),
      description: t('loans.description'),
      Icon: LoansIcon,
      route: LoanRoutes.Loan,
      quickAccess: 5,
      label: t('loans.label'),
    }),
    ...addConditionally(isFeatureEnabled('payroll', enabledFeatures), {
      name: t('payslips.name'),
      description: t('payslips.description'),
      Icon: PayslipsIcon,
      route: PayslipRoutes.Payslips,
      quickAccess: 2,
      label: t('payslips.label'),
    }),
    ...addConditionally(isFeatureEnabled('documents', enabledFeatures), {
      name: t('documents.name'),
      description: t('documents.description'),
      Icon: DocumentsIcon,
      route: DocumentRoutes.Documents,
      quickAccess: 6,
      label: t('documents.label'),
    }),
    ...addConditionally(isFeatureEnabled('assets', enabledFeatures), {
      name: t('assets.name'),
      description: t('assets.description'),
      Icon: AssetsIcon,
      route: AssetRoutes.Asset,
      quickAccess: 7,
      label: t('assets.label'),
    }),
    ...addConditionally(isFeatureEnabled('employees', enabledFeatures), {
      name: t('people.name'),
      description: t('people.description'),
      Icon: PeopleIcon,
      route: PeopleRoutes.Peoples,
      quickAccess: 10,
      label: t('people.label'),
    }),
    ...addConditionally(
      isFeatureEnabled('overtime-from-sheets', enabledFeatures) &&
      Boolean(accountSettings.use_dated_overtime),
      {
        name: t('overtime.name'),
        description: t('overtime.description'),
        Icon: OvertimeIcon,
        route: OvertimeRoutes.Overtime,
        quickAccess: 8,
        label: t('overtime.label'),
      },
    ),
    ...addConditionally(
      isFeatureEnabled('salary-advance', enabledFeatures) && !isWRKPYEnabled,
      {
        name: t('advance.name'),
        description: t('advance.description'),
        Icon: AdvanceIcon,
        route: AdvanceRoutes.Advance,
        quickAccess: 9,
        label: t('advance.label'),
      },
    ),
    ...addConditionally(
      isFeatureEnabled('salary-advance', enabledFeatures) && isWRKPYEnabled,
      {
        name: t('advance.name'),
        description: t('advance.description'),
        Icon: AdvanceIcon,
        route: AdvanceLoanRoutes.Loan,
        quickAccess: 9,
        label: t('advance.label'),
      },
    ),
    // ...addConditionally(hasTa, {
    // ...addConditionally(isFeatureEnabled('salary-advance', enabledFeatures), {
    //   name: 'Salary Advance',
    //   description: 'Secure salary advances with ease',
    //   Icon: AdvanceIcon,
    //   route: AdvanceRoutes.Advance,
    //   quickAccess: 9,
    //   label: `Apply for ${'\n'} advance`,
    // }),

    ...addConditionally(taAvailable, {
      name: t('ta.name'),
      description: t('ta.description'),
      Icon: TAIcon,
      route: TARoutes.TA,
      quickAccess: 11,
      label: t('ta.label'),
    }),
  ]

  return { menuItems, enabledFeatures }
}
