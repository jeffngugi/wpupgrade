import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeTabNavigator from './HomeTabNavigator'
import {
  AccountsRoutes,
  EwaRoutes,
  MainStackParamList,
  PayslipRoutes,
  PeopleRoutes,
  OvertimeRoutes,
  DocumentRoutes,
  AdvanceRoutes,
  ExpenseRoutes,
  AssetRoutes,
  LeaveRoutes,
  LoanRoutes,
  TARoutes,
  AdvanceLoanRoutes,
  NotificationRoutes,
  WalletRoutes,
  LeaveRoutesRedesign,
  ExpenseRoutesRedesign,
} from '../types'
import ProfileScreen from '../screens/account/ProfileScreen'
import ContactPersonScreen from '../screens/account/ContactPersonScreen'
import EditContactPersonScreen from '../screens/account/EditContactPersonScreen'
import EditEmailScreen from '../screens/account/EditEmailScreen'
import EmploymentDetailScreen from '../screens/account/EmploymentDetailScreen'
import EditAddressScreen from '../screens/account/EditAddressScreen'
import AddContactPersonScreen from '../screens/account/AddContactPersonScreen'
import AccountPasswordScreen from '../screens/account/AccountPasswordScreen'
import ManagePinScreen from '../screens/authentication/managePin/ManagePinScreen'
import SetPinScreen from '../screens/account/SetPinScreen'
import ForgotPinScreen from '../screens/account/ForgotPinScreen'
import AddEducationScreen from '../screens/account/AddEducationScreen'
import Payslips from '../screens/payslips/Payslips'
import SinglePayslip from '../screens/payslips/SinglePayslip'
import Ewa from '../screens/ewa/Ewa'
import EwaSendMoney from '../screens/ewa/EwaSendMoney'
import EwaTransactionDetails from '../screens/ewa/EwaTransactionDetails'
import EwaOtp from '../screens/ewa/EwaOtp'
import EwaReview from '../screens/ewa/EwaReview'
import EwaSuccess from '../screens/ewa/EwaSuccess'
import Peoples from '../screens/people/Peoples'
import Person from '../screens/people/Person'
import Overtime from '../screens/overtime/Overtime'
import RequestOvertimeForm from '../screens/overtime/RequestOvertimeForm'
import AddDocument from '../screens/document/AddDocument'
import Document from '../screens/document/Document'
import Documents from '../screens/document/Documents'
import Advance from '~screens/advance/Advance'
import Expenses from '~screens/expenses/Expenses'
import Assets from '~screens/assets/Assets'
import Leaves from '~screens/leaves/Leaves'
import TA from '~screens/t-a/TA'
import Loans from '~screens/loans/Loans'
import ExpenseDetails from '~screens/expenses/ExpenseDetails'
import RecordExpense from '~screens/expenses/RecordExpense'
import ApplyLoan from '~screens/loans/ApplyLoan'
import LoanDetails from '~screens/loans/LoanDetails'
import LoanSchedule from '~screens/loans/LoanSchedule'
import LoanReview from '~screens/loans/LoanReview'
import RequestLeave from '~screens/leaves/RequestLeave'
import LeaveDetails from '~screens/leaves/LeaveDetails'
import AdvanceDetails from '~screens/advance/AdvanceDetails'
import ApplyAdvance from '~screens/advance/ApplyAdvance'
import AdvanceLoans from '~screens/advance-workpay/Loans'
import AdvanceApplyLoan from '~screens/advance-workpay/ApplyLoan'
import AdvanceLoanDetails from '~screens/advance-workpay/LoanDetails'
import AdvanceLoanSchedule from '~screens/advance-workpay/LoanSchedule'
import AdvanceLoanReview from '~screens/advance-workpay/LoanReview'
import SupportScreen from '~screens/account/SupportScreen'
import AddNextOfKin from '~screens/account/AddNextOfKin'
import EditNextOfKin from '~screens/account/EditNextOfKin'
import AttendanceReport from '~screens/t-a/AttendanceReport'
import AttendanceDownload from '~screens/t-a/AttendanceDownload'
import OvertimeDetail from '~screens/overtime/OvertimeDetail'
import SwitchCompany from '~screens/account/SwitchCompany'
import EditEducationScreen from '~screens/account/EditEducationDetails'
import ScanQRCode from '~screens/t-a/ScanQRCode'
import useGetClockAttempts from '~utils/hooks/useGetClockAttempts'
import { useDispatch, useSelector } from 'react-redux'
import { addAttempts } from '~store/actions/TA'
import { State } from '~declarations'
import { useClockInOut } from '~api/t-a/useClockInOut'
import P9Forms from '~screens/account/p9Forms/Index'
import Notification from '~screens/notification/Notification'
import WalletRegistration1 from '~screens/wallet/opt-in/WalletRegistration1'
import WalletRegistration2 from '~screens/wallet/opt-in/WalletRegistration2'
import WalletRegistration3 from '~screens/wallet/opt-in/WalletRegistration3'
import { useNotifications } from '~utils/notifications/useNotifications'
import WalletSetting from '~screens/wallet/WalletSetting'
import WalletTransactions from '~screens/wallet/WalletTransactions'
import LinkAccount from '~screens/wallet/LinkAccount'
import LinkedAccounts from '~screens/wallet/LinkedAccounts'
import FundWallet from '~screens/wallet/FundWallet'
import FundWalletForm from '~screens/wallet/FundWalletForm'
import SendMoney from '~screens/wallet/SendMoney'
import SendToBank from '~screens/wallet/SendToBank'
import SendToMobile from '~screens/wallet/SendToMobile'
import SendToWallet from '~screens/wallet/SendToWallet'
import SendMoneyAmountForm from '~screens/wallet/SendMoneyAmountForm'
import SendMoneyConfirm from '~screens/wallet/SendMoneyConfirm'
import WalletBeneficiaries from '~screens/wallet/WalletBeneficiaries'
import WalletPinChange from '~screens/wallet/WalletPinChange'

import CreateRecurringPayment from '~screens/wallet/CreateRecurringPayment'
import CreateRecurringPayment2 from '~screens/wallet/CreateRecurringPayment2'
import CreateRecurringPayment3 from '~screens/wallet/CreateRecurringPayment3'
import WalletWithdrawForm from '~screens/wallet/WalletWithdrawForm'

import WalletTwaFa from '~screens/wallet/settings/security/WalletTwaFa'
import WalletTransactionDetails from '~screens/wallet/WalletTransactionDetails'
import RecurringPayments from '~screens/wallet/RecurringPayments'
import RecurringPaymentDetail from '~screens/wallet/RecurringPaymentDetail'
import WalletSecurity from '~screens/wallet/settings/security/WalletSecurity'
import WalletTranscationCategories from '~screens/wallet/settings/transaction-categories/WalletTranscationCategories'
import AddTransactionCategory from '~screens/wallet/settings/transaction-categories/AddTransactionCategory'
import WalletProfile from '~screens/wallet/settings/profile/WalletProfile'
import WalletNotifications from '~screens/wallet/settings/notifications/Index'
import WalletOptOut from '~screens/wallet/settings/opt-out/WalletOptOut'
import WalletWithdrawConfirm from '~screens/wallet/WalletWithdrawConfirm'
import FingerPrintScreen from '~screens/authentication/pincode/FingerPrintScreen'

import PinCodeRegistration from '~screens/authentication/pincode/PinCodeRegistration'
import PinCodeScreen from '~screens/authentication/pincode'
import WalletStatement from '~screens/wallet/components/modals/WalletStatement'
import LeavesRedesign from '~screens/leaves-redesign/Leaves'
import RequestLeaveRedesign from '~screens/leaves-redesign/RequestLeave'
import LeaveDetailsRedesign from '~screens/leaves-redesign/LeaveDetails'
import PayMerchant from '~screens/wallet/payments/PayMerchant'
import PayMerchantForm from '~screens/wallet/payments/PayMerchantForm'
import PayMerchantAmountForm from '~screens/wallet/payments/PayMerchantAmountForm'
import PayMerchantReview from '~screens/wallet/payments/PayMerchantReview'
import ExpenseRedesign from '~screens/expenses-redesign/Expenses'
import ApplyExpense from '~screens/expenses-redesign/RecordExpense'
import ExpenseDetailsRedesign from '~screens/expenses-redesign/ExpenseDetails'
import ExpenseOptions from '~screens/expenses-redesign/containers/ExpenseOptions'

const MainStack = createNativeStackNavigator<MainStackParamList>()
const { Screen, Navigator, Group } = MainStack

const MainStackNavigator = () => {
  const dispatch = useDispatch()
  const { clockInsOuts } = useSelector((state: State) => state.ta)

  const { clockAttempts } = useGetClockAttempts() //cached attempts from sqlite storage

  useEffect(() => {
    if (clockAttempts.length > 0) {
      dispatch(addAttempts(clockAttempts))
    }
  }, [clockAttempts])

  useClockInOut(clockInsOuts)

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name="HomeTabNavigator" component={HomeTabNavigator} />
      <Screen name={AccountsRoutes.Profile} component={ProfileScreen} />
      <Screen
        name={AccountsRoutes.ContactPerson}
        component={ContactPersonScreen}
      />
      <Screen name={AccountsRoutes.EditAddress} component={EditAddressScreen} />
      <Screen
        name={AccountsRoutes.EditContactPerson}
        component={EditContactPersonScreen}
      />
      <Screen name={AccountsRoutes.EditEmail} component={EditEmailScreen} />
      <Screen
        name={AccountsRoutes.EmploymentDetail}
        component={EmploymentDetailScreen}
      />
      <Screen name={AccountsRoutes.MananagePin} component={ManagePinScreen} />
      <Screen name={AccountsRoutes.SetPin} component={SetPinScreen} />
      <Screen name={AccountsRoutes.ForgotPin} component={ForgotPinScreen} />
      <Screen name={AccountsRoutes.Support} component={SupportScreen} />
      <Screen name={AccountsRoutes.PinCodeScreen} component={PinCodeScreen} />
      <Screen
        name={AccountsRoutes.PinCodeRegistration}
        component={PinCodeRegistration}
      />
      <Screen
        name={AccountsRoutes.SetUpFingerPrint}
        component={FingerPrintScreen}
      />
      <Screen
        name={AccountsRoutes.AccountPassword}
        component={AccountPasswordScreen}
      />
      <Screen
        name={AccountsRoutes.AddContactPerson}
        component={AddContactPersonScreen}
      />
      <Screen name={AccountsRoutes.AddNextOfKin} component={AddNextOfKin} />
      <Screen name={AccountsRoutes.EditNextOfKin} component={EditNextOfKin} />

      <Screen
        name={AccountsRoutes.EditEducation}
        component={EditEducationScreen}
      />
      <Screen
        name={AccountsRoutes.AddEducation}
        component={AddEducationScreen}
      />
      <Screen name={AccountsRoutes.SwitchCompany} component={SwitchCompany} />
      <Screen name={AccountsRoutes.P9Forms} component={P9Forms} />
      <Screen name={PayslipRoutes.Payslips} component={Payslips} />
      <Screen name={PayslipRoutes.SinglePayslip} component={SinglePayslip} />
      <Screen name={EwaRoutes.Ewa} component={Ewa} />
      <Screen name={EwaRoutes.SendMoney} component={EwaSendMoney} />
      <Screen
        name={EwaRoutes.TransctionDetails}
        component={EwaTransactionDetails}
      />
      <Screen name={EwaRoutes.EwaOTP} component={EwaOtp} />
      <Screen name={EwaRoutes.EwaReview} component={EwaReview} />
      <Screen name={EwaRoutes.EwaSuccess} component={EwaSuccess} />
      <Screen name={PeopleRoutes.Peoples} component={Peoples} />
      <Screen name={PeopleRoutes.Person} component={Person} />
      <Screen name={OvertimeRoutes.Overtime} component={Overtime} />
      <Screen
        name={OvertimeRoutes.RequestForm}
        component={RequestOvertimeForm}
      />
      <Screen name={OvertimeRoutes.Details} component={OvertimeDetail} />
      <Screen name={DocumentRoutes.AddDocument} component={AddDocument} />
      <Screen name={DocumentRoutes.Details} component={Document} />
      <Screen name={DocumentRoutes.Documents} component={Documents} />
      <Screen name={AdvanceRoutes.Advance} component={Advance} />
      <Screen name={AdvanceRoutes.Detail} component={AdvanceDetails} />
      <Screen name={AdvanceRoutes.Apply} component={ApplyAdvance} />
      <Screen name={AdvanceLoanRoutes.Loan} component={AdvanceLoans} />
      <Screen name={AdvanceLoanRoutes.Apply} component={AdvanceApplyLoan} />
      <Screen name={AdvanceLoanRoutes.Detail} component={AdvanceLoanDetails} />
      <Screen name={AdvanceLoanRoutes.Review} component={AdvanceLoanReview} />
      <Screen
        name={AdvanceLoanRoutes.Schedule}
        component={AdvanceLoanSchedule}
      />
      <Screen name={ExpenseRoutes.Expense} component={Expenses} />
      <Screen name={ExpenseRoutes.Record} component={RecordExpense} />
      <Screen name={ExpenseRoutes.Details} component={ExpenseDetails} />

      <Screen
        name={ExpenseRoutesRedesign.Expense}
        component={ExpenseRedesign}
      />
      <Screen
        name={ExpenseRoutesRedesign.Record}
        component={ApplyExpense}
      />
      <Screen
        name={ExpenseRoutesRedesign.Details}
        component={ExpenseDetailsRedesign}
      />
      <Screen name={ExpenseRoutesRedesign.ExpenseOptions} component={ExpenseOptions} />


      <Screen name={AssetRoutes.Asset} component={Assets} />
      <Screen name={LeaveRoutes.Leave} component={Leaves} />
      <Screen name={LeaveRoutes.Request} component={RequestLeave} />
      <Screen name={LeaveRoutes.Details} component={LeaveDetails} />

      <Screen name={LeaveRoutesRedesign.Leave} component={LeavesRedesign} />
      <Screen
        name={LeaveRoutesRedesign.Request}
        component={RequestLeaveRedesign}
      />
      <Screen
        name={LeaveRoutesRedesign.Details}
        component={LeaveDetailsRedesign}
      />




      <Screen name={LoanRoutes.Loan} component={Loans} />
      <Screen name={LoanRoutes.Apply} component={ApplyLoan} />
      <Screen name={LoanRoutes.Detail} component={LoanDetails} />
      <Screen name={LoanRoutes.Review} component={LoanReview} />
      <Screen name={LoanRoutes.Schedule} component={LoanSchedule} />
      <Screen name={TARoutes.TA} component={TA} />
      <Screen name={TARoutes.Report} component={AttendanceReport} />
      <Screen name={TARoutes.Download} component={AttendanceDownload} />
      <Screen name={TARoutes.Scan} component={ScanQRCode} />
      <Screen name={NotificationRoutes.Notification} component={Notification} />
      <Screen
        name={WalletRoutes.PersonalDetail}
        component={WalletRegistration1}
      />
      <Screen
        name={WalletRoutes.SecurityQuestion}
        component={WalletRegistration2}
      />
      <Screen name={WalletRoutes.CreatePin} component={WalletRegistration3} />
      <Screen name={WalletRoutes.Setting} component={WalletSetting} />
      <Screen name={WalletRoutes.OptOut} component={WalletOptOut} />
      <Screen name={WalletRoutes.Transactions} component={WalletTransactions} />
      <Screen name={WalletRoutes.LinkAccount} component={LinkAccount} />
      <Screen name={WalletRoutes.LinkedAccounts} component={LinkedAccounts} />
      <Screen name={WalletRoutes.FundWallet} component={FundWallet} />
      <Screen name={WalletRoutes.FundWalletForm} component={FundWalletForm} />
      <Screen name={WalletRoutes.SendMoney} component={SendMoney} />
      <Screen name={WalletRoutes.SendToBank} component={SendToBank} />
      <Screen name={WalletRoutes.SendToMobile} component={SendToMobile} />
      <Screen name={WalletRoutes.SendToWallet1} component={SendToWallet} />
      <Screen name={WalletRoutes.Security} component={WalletSecurity} />
      <Screen name={WalletRoutes.WalletPinChange} component={WalletPinChange} />
      <Screen name={WalletRoutes.TwoFA} component={WalletTwaFa} />
      <Screen name={WalletRoutes.Profile} component={WalletProfile} />
      <Screen name={WalletRoutes.Merchant} component={PayMerchant} />
      <Screen name={WalletRoutes.MerchantForm} component={PayMerchantForm} />
      <Screen
        name={WalletRoutes.MerchantAmountForm}
        component={PayMerchantAmountForm}
      />
      <Screen
        name={WalletRoutes.MerchantReview}
        component={PayMerchantReview}
      />
      <Screen
        name={WalletRoutes.TransactionDetail}
        component={WalletTransactionDetails}
      />
      <Screen
        name={WalletRoutes.Beneficiaries}
        component={WalletBeneficiaries}
      />
      <Screen
        name={WalletRoutes.Notifications}
        component={WalletNotifications}
      />
      <Screen
        name={WalletRoutes.SendMoneyAmountForm}
        component={SendMoneyAmountForm}
      />
      <Screen
        name={WalletRoutes.SendMoneyConfirm}
        component={SendMoneyConfirm}
      />
      <Screen
        name={WalletRoutes.RecurringPayment}
        component={RecurringPayments}
      />
      <Screen
        name={WalletRoutes.RecurringDetails}
        component={RecurringPaymentDetail}
      />
      <Screen
        name={WalletRoutes.CreateRecurringPayment}
        component={CreateRecurringPayment}
      />
      <Screen
        name={WalletRoutes.CreateRecurringPayment2}
        component={CreateRecurringPayment2}
      />
      <Screen
        name={WalletRoutes.CreateRecurringPayment3}
        component={CreateRecurringPayment3}
      />
      <Screen
        name={WalletRoutes.WithdrawMoneyAmountForm}
        component={WalletWithdrawForm}
      />
      <Screen
        name={WalletRoutes.TransactionCategories}
        component={WalletTranscationCategories}
      />
      <Screen
        name={WalletRoutes.AddWalletTransactionCategory}
        component={AddTransactionCategory}
      />
      <Screen
        name={WalletRoutes.WithdrawConfirm}
        component={WalletWithdrawConfirm}
      />
      <Group screenOptions={{ presentation: 'modal' }}>
        <Screen
          name={WalletRoutes.WalletStatements}
          component={WalletStatement}
        />
      </Group>
    </Navigator>
  )
}

export default MainStackNavigator
