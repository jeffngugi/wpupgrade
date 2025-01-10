import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {SvgProps} from 'react-native-svg';
import {optionsType} from '~components/DropDownPicker';
import {TExpenseItem} from '~screens/expenses/types';
import {
  Amortisation,
  LoanReviewDetails,
  TLoanDetail,
} from '~screens/loans/types';
import {TPayslip} from '~screens/payslips/types';
import {TColleague} from '~screens/people/types';
import {TRecurringAccount} from '~screens/wallet/CreateRecurringPayment';
import {TRecurringAccount2} from '~screens/wallet/CreateRecurringPayment2';
import {FundSourceType} from '~screens/wallet/data/useWalletData';
import {
  IRecurringPayment,
  IWalletTransactionItem,
  TWithdrawResponse,
} from '~screens/wallet/types';

export type MainNavigationRouteProp<T extends keyof MainStackParamList> =
  RouteProp<MainStackParamList, T>;

export type MainNavigationProp<T extends keyof MainStackParamList> =
  NativeStackNavigationProp<MainStackParamList, T> & {
    navigation: MainNavigationRouteProp<T>;
    route: MainNavigationProp<T>;
  };

export type RootStackParamList = {
  AuthScreens: undefined;
  MainScreens: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  TabOne: undefined;
  TabTwo: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type AuthStackParamList = {
  Slider: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  VerificationCode: undefined;
  ResetPassword: {code: string};
  ConfirmPassword: undefined;
};

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, Screen>;

export type HomeTabParamList = {
  Home: undefined;
  Wallet: undefined;
  Menu: undefined;
  Account: undefined;
};

export type TEWAChargeData = {
  access_fee: number | string;
  access_fee_rate: string;
  amount_to_receive: number | string;
  amount_to_repay: number | string;
  requested_amount: string | number;
  transaction_charge: string;
};

export type TEwaFavourite = {
  account_number: string;
  bank_address: null;
  bank_branch_name: string;
  bank_id: number;
  bank_name: string;
  branch_id: number;
  city: null;
  company_id: number;
  country_id: number;
  country_name: string;
  created_at: Date;
  currency_code: string;
  currency_id: number;
  currency_name: string;
  for_employee_id: number;
  id: number;
  mobile: null;
  name: string;
  paybill_number: null;
  payment_method: string;
  postal_code: null;
  recipient_address: null;
  recipient_email_address: null;
  recipient_first_name: null;
  recipient_last_name: null;
  recipient_mobile_number: null;
  till_number: null;
  type: string | null;
  updated_at: Date;
};

export type EWAOTPRouteParams = {
  cacheId: number;
  ewaId: number;
  newSubmitData: TNewSubmitData;
  userPaymentCache: number;
};

export type TNewSubmitData = TEwaSubmitData & {
  v2: boolean;
  self_disburse: number;
  selfservice: boolean;
  employee_id: string | number;
};

export type TEwaSubmitData = {
  payment_method: string;
  amount: string;
  currency_id: string;
  recipient_number?: string;
  accName?: string;
  acc_no?: string;
  bank_id?: string;
  branch_id?: string;
  phone?: string;
};

export type TBeneficiary = {
  mobile?: string | undefined;
  name?: string | undefined;
  account_number?: string | undefined;
  bank_id?: string | undefined;
  branch_id?: number | undefined;
  payment_method: string;
};
export type TResendOtp = {
  cacheId: number;
  amount: string;
  recipient_item_id: number;
};

export type TConfirmOtp = {
  payment_cache_id: number;
  pin: number | string;
  selfservice: 1 | 0 | boolean;
  employee_id: string | number;
};

export type TCompleteEwaWithdrawal = {
  payment_cache_id: string | number;
  advance_id: string | number;
};

export type PayslipCardProps = {
  date: string;
  amount: string;
  status: string | 'Paid';
  payslip: TPayslip;
  showAmount: boolean;
  isLocalPayslip?: boolean;
};

export type FileData = {
  name: string;
  type: string;
  category: string;
  uri: string;
  amount: string;
};

export type SupportDocData = {
  name: string;
  type: string;
  category: string;
  uri: string;
};
export interface LoanReviewParams {
  no_of_months: number;
  currency_id?: number;
  principal: number;
  start_date?: string;
  proof_of_residence?: FileData;
  financial_statement?: FileData;
  reason?: string;
  isEdit?: boolean;
  itemId?: number;
  noOfMonths?: number;
  startDate?: string;
  proofOfResidenceFiles?: FileData[];
  financialStatementFiles?: FileData[];
}

export type HomeTabScreenProps<Screen extends keyof HomeTabParamList> =
  BottomTabScreenProps<HomeTabParamList, Screen>;

export type LoginScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, 'Login'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ESendToID = 'wallet' | 'mobile' | 'bank';
export type WMerchantType = 'PAYBILL' | 'TILL';
export type TLipaAccount = {
  account_number?: string;
  merchant_number: string;
};

export type TLipaSubmitData = {
  merchant_number: string;
  amount: string | number;
  category_id: string;
  payment_method: WMerchantType;
  wallet_id: string;
  account_number?: string;
};

export type TWalletTransferResponse = {
  account_name: string | null;
  account_number: string | null;
  amount: string;
  bank: string | null;
  bank_id: string | null;
  category_id: string;
  category_name: string;
  currency: string;
  description: string | null;
  fees: string;
  internal_reference: string;
  payment_method: string;
  payment_method_name: string;
  recipient_name: string | null;
  status_message: string | null;
  uuid: string;
};

export type TSendMoneyConfirm = {
  sendToId: ESendToID;
  sendToData: TSendToData;
  successData: any;
  displayAcc: string;
  displayName: string;
};

export type TSendToData = {
  recipient_wallet_identifier?: string | undefined;
  bank_id?: string | undefined;
  account_number?: string | undefined;
  account_name?: string | undefined;
  phone_number?: string | undefined;
  category_id: any;
  wallet_id: string;
  amount: string;
  payment_method: string;
  description: string;
};

export type MainStackParamList = {
  HomeTabNavigator: undefined;
  [AccountsRoutes.Profile]: undefined;
  [AccountsRoutes.ContactPerson]: undefined;
  [AccountsRoutes.EditAddress]: undefined;
  [AccountsRoutes.EditContactPerson]: undefined;
  [AccountsRoutes.EditEmail]: undefined;
  [AccountsRoutes.EmploymentDetail]: undefined;
  [AccountsRoutes.SetUpFingerPrint]: undefined;
  [AccountsRoutes.MananagePin]: undefined;
  [AccountsRoutes.AccountPassword]: undefined;
  [AccountsRoutes.AddContactPerson]: undefined;
  [AccountsRoutes.SetPin]: undefined;
  [AccountsRoutes.ForgotPin]: undefined;
  [AccountsRoutes.Support]: undefined;
  [AccountsRoutes.AddEducation]: undefined;
  [AccountsRoutes.EditEducation]: undefined;
  [AccountsRoutes.EditNextOfKin]: undefined;
  [AccountsRoutes.EditNextOfKin]: undefined;
  [AccountsRoutes.AddNextOfKin]: undefined;
  [AccountsRoutes.SwitchCompany]: undefined;
  [AccountsRoutes.P9Forms]: undefined;
  [AccountsRoutes.PinCodeRegistration]: undefined;
  [AccountsRoutes.PinCodeScreen]: undefined;
  [PayslipRoutes.Payslips]: undefined;
  [PayslipRoutes.SinglePayslip]: {payslip: TPayslip; isLocalPayslip: boolean};
  [EwaRoutes.Ewa]: undefined;
  [EwaRoutes.SendMoney]: {ewaSendMethod: EwaSendMethods; item?: TEwaFavourite};
  [EwaRoutes.TransctionDetails]: {item: TEwaTransaction};
  [EwaRoutes.EwaReview]: {
    chargesData: TEWAChargeData;
    submitData: TEwaSubmitData;
  };
  [EwaRoutes.EwaSuccess]: {formData: TEwaSubmitData};
  [EwaRoutes.EwaOTP]: EWAOTPRouteParams;
  [OvertimeRoutes.RequestForm]: undefined;
  [OvertimeRoutes.Overtime]: undefined;
  [OvertimeRoutes.Details]: undefined;
  [PeopleRoutes.Peoples]: undefined;
  [PeopleRoutes.Person]: {person: TColleague};
  [DocumentRoutes.Documents]: undefined;
  [DocumentRoutes.AddDocument]: undefined;
  [DocumentRoutes.Details]: undefined;
  [LeaveRoutes.All]: undefined;
  [LeaveRoutes.Approved]: undefined;
  [LeaveRoutes.Details]: undefined;
  [LeaveRoutes.Disapproved]: undefined;
  [LeaveRoutes.Leave]: undefined;
  [LeaveRoutes.Pending]: undefined;
  [LeaveRoutes.Request]: undefined;
  [LoanRoutes.Active]: undefined;
  [LeaveRoutes.Details]: undefined;
  [LoanRoutes.All]: undefined;
  [LoanRoutes.Completed]: undefined;
  [LoanRoutes.Detail]: {loanDetail: TLoanDetail};
  [LoanRoutes.Disapproved]: undefined;
  [LoanRoutes.Loan]: undefined;
  [LoanRoutes.Pending]: undefined;
  [LoanRoutes.Apply]: undefined;
  [LoanRoutes.Schedule]: {loanSchedule: Amortisation[]; currencyCode: string};
  [LoanRoutes.Review]: {reviewDetails: LoanReviewDetails};
  [ExpenseRoutes.All]: undefined;
  [ExpenseRoutes.Approved]: undefined;
  [ExpenseRoutes.Disapproved]: undefined;
  [ExpenseRoutes.Expense]: undefined;
  [ExpenseRoutes.Paid]: undefined;
  [ExpenseRoutes.Pending]: undefined;
  [ExpenseRoutes.Details]: {item: TExpenseItem};
  [ExpenseRoutes.Record]: undefined;
  [AdvanceRoutes.Advance]: undefined;
  [AdvanceRoutes.All]: undefined;
  [AdvanceRoutes.Approved]: undefined;
  [AdvanceRoutes.Disapproved]: undefined;
  [AdvanceRoutes.Pending]: undefined;
  [AdvanceRoutes.Detail]: undefined;
  [AdvanceRoutes.Apply]: undefined;
  [AdvanceLoanRoutes.All]: undefined;
  [AdvanceLoanRoutes.Completed]: undefined;
  [AdvanceLoanRoutes.Detail]: undefined;
  [AdvanceLoanRoutes.Disapproved]: undefined;
  [AdvanceLoanRoutes.Loan]: undefined;
  [AdvanceLoanRoutes.Pending]: undefined;
  [AdvanceLoanRoutes.Apply]: undefined;
  [AdvanceLoanRoutes.Schedule]: undefined;
  [AdvanceLoanRoutes.Review]: LoanReviewParams;
  [AssetRoutes.Asset]: undefined;
  [TARoutes.TA]: undefined;
  [TARoutes.Report]: undefined;
  [TARoutes.Download]: undefined;
  [TARoutes.Scan]: undefined;
  [NotificationRoutes.Notification]: undefined;
  [WalletRoutes.Main]: undefined;
  [WalletRoutes.OptInSuccess]: undefined;
  [WalletRoutes.PersonalDetail]: undefined;
  [WalletRoutes.SecurityQuestion]: undefined;
  [WalletRoutes.CreatePin]: undefined;
  [WalletRoutes.LinkedAccounts]: undefined;
  [WalletRoutes.LinkAccount]: undefined;
  [WalletRoutes.Transactions]: undefined;
  [WalletRoutes.TransactionDetail]: {item: IWalletTransactionItem};
  [WalletRoutes.SendMoney]: undefined;
  [WalletRoutes.SendMoneyAmountForm]: {
    sendToId: ESendToID;
    recipientName: string;
    bank_id?: string;
    account_number?: string;
    account_name?: string;
    mobileNumber?: string;
    walletAccNo?: string;
  };
  [WalletRoutes.WithdrawConfirm]: {
    withdrawData: TWithdrawResponse;
  };
  [WalletRoutes.SendMoneyConfirm]: TSendMoneyConfirm;
  [WalletRoutes.SendToWallet1]: undefined;
  [WalletRoutes.SendToWallet2]: undefined;
  [WalletRoutes.SendToMobile]: undefined;
  [WalletRoutes.SendToBank]: undefined;
  [WalletRoutes.ConfirmTransfer]: undefined;
  [WalletRoutes.TransferSuccess]: undefined;
  [WalletRoutes.Bill]: undefined;
  [WalletRoutes.StatutoryPayments]: undefined;
  [WalletRoutes.BuyAirTime]: undefined;
  [WalletRoutes.BuyAirTimeForm]: undefined;
  [WalletRoutes.UtilityBill]: undefined;
  [WalletRoutes.Merchant]: undefined;
  [WalletRoutes.MerchantForm]: {merchantType: WMerchantType};
  [WalletRoutes.MerchantAmountForm]: {
    merchantType: WMerchantType;
    lipaAccount: TLipaAccount;
    recipientName: string;
  };
  [WalletRoutes.MerchantReview]: {
    merchantType: WMerchantType;
    submitData: TLipaSubmitData;
    successData: TWalletTransferResponse;
    recipientName: string;
  };
  [WalletRoutes.Savings]: undefined;
  [WalletRoutes.SavingsForm]: undefined;
  [WalletRoutes.SavingSource]: undefined;
  [WalletRoutes.SavingTransactions]: undefined;
  [WalletRoutes.FundWallet]: undefined;
  [WalletRoutes.FundWalletForm]: {
    fundSource: FundSourceType;
    amount: string;
    reference?: string;
  };
  [WalletRoutes.Setting]: undefined;
  [WalletRoutes.OptOut]: undefined;
  [WalletRoutes.Security]: undefined;
  [WalletRoutes.SecurityPad]: undefined;
  [WalletRoutes.TwoFA]: undefined;
  [WalletRoutes.Notifications]: undefined;
  [WalletRoutes.Beneficiaries]: undefined;
  [WalletRoutes.RecurringPayment]: undefined;
  [WalletRoutes.RecurringDetails]: {item: IRecurringPayment};
  [WalletRoutes.CreateRecurringPayment]: undefined;
  [WalletRoutes.RecurringPaymentSelector]: undefined;
  [WalletRoutes.CreateRecurringPayment2]: {item: TRecurringAccount};
  [WalletRoutes.CreateRecurringPayment3]: {item: TRecurringAccount2};
  [WalletRoutes.WalletPinChange]: undefined;
  [WalletRoutes.WithdrawMoneyAmountForm]: {item: TLinkedAccount};
  [WalletRoutes.TransactionCategories]: undefined;
  [WalletRoutes.AddWalletTransactionCategory]: undefined;
  [WalletRoutes.Profile]: undefined;
  [WalletRoutes.WalletStatements]: undefined;
  [LeaveRoutesRedesign.All]: undefined;
  [LeaveRoutesRedesign.Approved]: undefined;
  [LeaveRoutesRedesign.Details]: undefined;
  [LeaveRoutesRedesign.Disapproved]: undefined;
  [LeaveRoutesRedesign.Leave]: undefined;
  [LeaveRoutesRedesign.Pending]: undefined;
  [LeaveRoutesRedesign.Request]: undefined;

  [ExpenseRoutesRedesign.All]: undefined;
  [ExpenseRoutesRedesign.Approved]: undefined;
  [ExpenseRoutesRedesign.Disapproved]: undefined;
  [ExpenseRoutesRedesign.Expense]: undefined;
  [ExpenseRoutesRedesign.Paid]: undefined;
  [ExpenseRoutesRedesign.Details]: {item: TExpenseItem};
  [ExpenseRoutesRedesign.Record]: undefined;
  [ExpenseRoutesRedesign.ExpenseOptions]: undefined;
};

export type NoNetParamList = {
  [NoNetRoutes.NoNet]: undefined;
  [NoNetRoutes.NoNetAttempts]: undefined;
};

export enum AccountsRoutes {
  Profile = 'Profile',
  ContactPerson = 'ContactPerson',
  EditAddress = 'EditAddress',
  EditContactPerson = 'EditContactPerson',
  EditNextOfKin = 'EditNextOfKin',
  EditEmail = 'EditEmail',
  EmploymentDetail = 'EmploymentDetail',
  MananagePin = 'MananagePin',
  AccountPassword = 'AccountPassword',
  AddContactPerson = 'AddContactPerson',
  AddNextOfKin = 'AddNextOfKin',
  SetPin = 'SetPin',
  ForgotPin = 'ForgotPin',
  AddEducation = 'AddEducation',
  EditEducation = 'EditEducation',
  Support = 'Support',
  SetUpFingerPrint = 'SetUpFingerPrint',
  SwitchCompany = 'SwitchCompany',
  P9Forms = 'P9Forms',
  PinCodeRegistration = 'PinCodeRegistration',
  PinCodeScreen = 'PinCodeScreen',
}

export enum NoNetRoutes {
  NoNet = 'NoInternet',
  NoNetAttempts = 'NoNetAttempts',
}
export enum PayslipRoutes {
  Payslips = 'Payslip',
  SinglePayslip = 'SinglePayslip',
}
export enum EwaRoutes {
  Ewa = 'Ewa',
  Transactions = 'Transactions',
  TransctionDetails = 'TransctionDetail',
  SendMoney = 'SendMoney',
  EwaReview = 'EwaReview',
  EwaSuccess = 'EwaSuccess',
  EwaOTP = 'EwaOTP',
}

export enum OvertimeRoutes {
  Overtime = 'Overtime',
  Requested = 'RequestOvertime',
  Approved = 'ApprovedOvertime',
  All = 'AllOvertime',
  Disapproved = 'DisapprovedOvertime',
  RequestForm = 'RequestForm',
  Details = 'OvertimeDetails',
}

export enum LeaveRoutes {
  Leave = 'Leave',
  Pending = 'PendingLeaves',
  Approved = 'ApprovedLeaves',
  All = 'AllLeaves',
  Disapproved = 'DisapprovedLeaves',
  Request = 'RequestLeave',
  Details = 'LeaveDetails',
  Attended = 'AttendedLeaves',
  Active = 'ActiveLeaves',
}

export enum LeaveRoutesRedesign {
  Leave = 'LeaveNew',
  Pending = 'PendingLeavesNew',
  Approved = 'ApprovedLeavesNew',
  All = 'AllLeavesNew',
  Disapproved = 'DisapprovedLeavesNew',
  Request = 'RequestLeaveNew',
  Details = 'LeaveDetailsNew',
  Attended = 'AttendedLeavesNew',
  Active = 'ActiveLeavesNew',
}

export enum LoanRoutes {
  Loan = 'Loan',
  All = 'AllLoans',
  Active = 'ActiveLoans',
  Inactive = 'InactiveLoans',
  Paused = 'PausedLoans',
  Completed = 'CompletedLoans',
  Disapproved = 'DisapprovedLoans',
  Pending = 'PendingLoans',
  Apply = 'ApplyLoan',
  Detail = 'LoanDetails',
  Schedule = 'LoanSchedule',
  Review = 'LoanReview',
}

export enum ExpenseRoutes {
  Expense = 'Expense',
  All = 'AllExpenses',
  Approved = 'ApprovedExpenses',
  Disapproved = 'DisapprovedExpenses',
  Pending = 'PendingExpenses',
  Paid = 'PaidExpenses',
  Details = 'ExpenseDetails',
  Record = 'RecordExpense',
}

export enum ExpenseRoutesRedesign {
  Expense = 'ExpenseNew',
  All = 'AllExpensesNew',
  Approved = 'ApprovedExpensesNew',
  Disapproved = 'DisapprovedExpensesNew',
  Pending = 'PendingExpensesNew',
  Paid = 'PaidExpensesNew',
  Details = 'ExpenseDetailsNew',
  Record = 'RecordExpenseNew',
  ExpenseOptions = 'ExpenseOptions',
}

export enum AdvanceRoutes {
  Advance = 'Advance',
  All = 'AllAdvances',
  Approved = 'ApprovedAdvances',
  Disapproved = 'DisapprovedAdvances',
  Pending = 'PendingAdvances',
  Detail = 'AdvanceDetails',
  Apply = 'ApplyAdvance',
  Paid = 'Paid',
}

export enum AdvanceLoanRoutes {
  Loan = 'AdvanceLoan',
  All = 'AdvanceAllLoans',
  Active = 'AdvanceActiveLoans',
  Inactive = 'AdvanceInactiveLoans',
  Paused = 'AdvancePausedLoans',
  Completed = 'AdvanceCompletedLoans',
  Disapproved = 'AdvanceDisapprovedLoans',
  Pending = 'AdvancePendingLoans',
  Apply = 'AdvanceApplyLoan',
  Detail = 'AdvanceLoanDetails',
  Schedule = 'AdvanceLoanSchedule',
  Review = 'AdvanceLoanReview',
}

export enum AssetRoutes {
  Asset = 'Asset',
}

export enum NotificationRoutes {
  Notification = 'Notification',
}

export enum WalletRoutes {
  Main = 'WalletMain',
  OptInSuccess = 'OptInSuccess',
  PersonalDetail = 'WalletPersonalDetails',
  SecurityQuestion = 'WalletSecurityQuestion',
  CreatePin = 'WalletCreatePin',
  LinkedAccounts = 'LinkedAccounts',
  LinkAccount = 'LinkAccount',
  Transactions = 'WalletTransactions',
  TransactionDetail = 'WalletTransactionsDetail',
  SendMoney = 'WalletSendMoney',
  SendMoneyAmountForm = 'SendWalletMonyAmountForm',
  WithdrawMoneyAmountForm = 'WalletWithdrawMoneyAmountForm',
  SendMoneyConfirm = 'SendToWalletReview',
  WithdrawConfirm = 'WalletWithdrawConfirm',
  SendToWallet1 = 'SendToWallet1',
  SendToWallet2 = 'SendToWallet2',
  SendToMobile = 'WalletSendToMobile',
  SendToBank = 'WalletSendToBank',
  ConfirmTransfer = 'ConfirmTransfer',
  TransferSuccess = 'TransferSuccess',
  Bill = 'WalletBill',
  StatutoryPayments = 'StatutoryPayments',
  BuyAirTime = 'WalletBuyAirtime',
  BuyAirTimeForm = 'WalletBuyAirtimeForm',
  UtilityBill = 'WalletUtilityBill',
  UtilityBillForm = 'WalletUtilityBillForm',
  Merchant = 'WalletMerchant',
  MerchantForm = 'WalletMerchantForm',
  MerchantAmountForm = 'WalletMerchantAmountForm',
  MerchantReview = 'WalletMerchantReview',
  Savings = 'WalletSavings',
  SavingsForm = 'WalletSavingsForm',
  SavingSource = 'WalletSavingSource',
  SavingTransactions = 'WalletSavingTransactions',
  FundWallet = 'FundWallet',
  FundWalletForm = 'FundWalletForm',
  Setting = 'WalletSettings',
  Profile = 'WalletProfile',
  OptOut = 'WalletOptOut',
  Security = 'WalletSecurity',
  SecurityPad = 'WalletSecurityPad',
  TwoFA = 'WalletTwoFAManagement',
  Notifications = 'WalletNotification',
  Beneficiaries = 'WalletBeneficiaries',
  CreateRecurringPayment = 'CreateWalletRecurringPaymentForm1',
  CreateRecurringPayment2 = 'CreateWalletRecurringPaymentForm2',
  CreateRecurringPayment3 = 'CreateWalletRecurringPaymentForm3',
  RecurringDetails = 'WalletRecurringPaymentDetail',
  RecurringPayment = 'WalletRecurringPayment',
  RecurringPaymentSelector = 'WalletRecurringPaymentSelector',
  WalletPinChange = 'WalletPinChange',
  TransactionCategories = 'TransactionCategories',
  AddWalletTransactionCategory = 'AddWalletTransactionCategory',
  WalletStatements = 'ExportWalletStatements',
}

export enum TARoutes {
  TA = 'TA',
  Report = 'AttendanceReport',
  Download = 'AttendanceDownload',
  Scan = 'ScanQRCode',
}
export enum PeopleRoutes {
  Peoples = 'Peoples',
  Person = 'Person',
}

export enum DocumentRoutes {
  Documents = 'Documents',
  AddDocument = 'AddDocument',
  Details = 'DocumentDetails',
}

export enum EwaSendMethods {
  mpesa = 'Mpesa',
  bank = 'Bank',
  wallet = 'Wallet',
}

export enum AppModules {
  leaves = 'Leaves',
  expenses = 'Expenses',
  ewa = 'Earned wage access',
  loans = 'Loans',
  payslips = 'Payslips',
  documents = 'Documents',
  assets = 'Assets',
  people = 'People',
  overtime = 'Overtime',
  advances = 'Salary Advance',
  ta = 'Time & Attendance',
  p9 = 'P9 Forms',
  walletTransactions = 'Wallet Transactions',
}

export type AccountSectionTypes = {
  title: string;
  data: AccountSectionItemType[];
};

export type AccountSectionItemType = {
  Icon: React.FC<SvgProps>;
  label: string;
  route: AccountsRoutes | WalletRoutes | null;
  id?: string;
};

export type NotificationSectionTypes = {
  title: string;
  data: NotificationSectionItemType[];
  description?: string;
};

interface SettingItem {
  name: string;
  value: string;
  uuid: string;
}

export type NotificationSectionItemType = {
  Icon?: React.FC<SvgProps>;
  label: string;
  route?: AccountsRoutes | WalletRoutes | null;
  id?: string;
  name?: string;
  status?: string | boolean;
  isEditable?: boolean;
  singular?: string;
  limitName?: string;
  options?: optionsType[];
  setting?: SettingItem;
};

export type LinkedAccountType = {
  bankName: string;
  accountName: string;
  accountNo: string;
};

export type TLinkedAccount = {
  acc_name: string;
  acc_no: string;
  bank: {
    code: string;
    id: number;
    name: string;
  };
  channel: string;
  name: string;
  type: string;
  uuid: string;
};

export type TAdvance = {
  amount: string;
  status: string;
  start_date: string;
  currency_code: string;
  approval_status: string;
  paid: 1 | 0;
};

export type TEwaTransaction = {
  id: number;
  amount: string;
  transactionId: string;
  status: 'Successful' | 'Pending' | 'Failed';
  currency: string;
  payment_method: string;
  created_at: string;
  workpay_code: string;
  mobile?: string;
  bank_address?: string;
  account_no?: string;
};

export type segmentUserTrait = {
  uniqueUserId: string;
  sharedUserId: string;
  isCompanyOwner: string;
  employeeId: string | number;
  name: string;
  company: {
    id: string;
    name: string;
    branchName: string;
  };
};

export type MainStackUseNavigationProp = NavigationProp<
  MainStackParamList,
  keyof MainStackParamList
>;
