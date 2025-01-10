import { SvgProps } from 'react-native-svg'
import BankIcon from '~assets/svg/wallet-bank.svg'
import CardIcon from '~assets/svg/credit-card.svg'
import MobileIcon from '~assets/svg/mobile.svg'
import MpesaIcon from '~assets/svg/mmpesa.svg'
import BasketIcon from '~assets/svg/Basket.svg'
import WalletIcon from '~assets/svg/wallet-setting.svg'
import ReceiptIcon from '~assets/svg/receipt.svg'
import { WalletRoutes, WMerchantType } from '~types'

export type FundSourceType = {
  source: string
  description: string
  Icon: React.FC<SvgProps>
  sourceId: 'Card' | 'Bank' | 'Mobile'
}

export type SendToType = {
  source: string
  description: string
  Icon: React.FC<SvgProps>
  route: string | null
}

export type PayToType = Omit<SendToType, 'description'> & {
  merchantType: WMerchantType
}

export type TMobileMProvider = {
  name: string
  Icon: React.FC<SvgProps>
}

export const useFundSourceData = () => {
  const fundSource: FundSourceType[] = [
    {
      source: 'Credit/Debit card',
      description: 'Send from your credit/debit card',
      Icon: CardIcon,
      sourceId: 'Card',
    },
    {
      source: 'Bank transfer',
      description: 'Transfer the money to your wallet using bank',
      Icon: BankIcon,
      sourceId: 'Bank',
    },
    {
      source: 'Mobile money',
      description: 'Transfer to your wallet from your mobile',
      Icon: MobileIcon,
      sourceId: 'Mobile',
    },
  ]

  return { fundSource }
}

export const useMobileMoneyProviders = () => {
  const data = [
    {
      name: 'Mpesa',
      Icon: MpesaIcon,
    },
    // {
    //   name: 'Airtel Money',
    //   Icon: ArtelIcon,
    // },
    // {
    //   name: 'Orange Money',
    //   Icon: OrangeIcon,
    // },
  ]

  return { data }
}

export const useWalletSendTo = () => {
  const sendToData: SendToType[] = [
    {
      source: 'Workpay wallet',
      description: 'Send to other wallet users',
      Icon: WalletIcon,
      route: WalletRoutes.SendToWallet1,
    },
    {
      source: 'Send to mobile',
      description: 'Send to mobile wallets',
      Icon: MobileIcon,
      route: WalletRoutes.SendToMobile,
    },
    {
      source: 'Send to Bank account',
      description: 'Transfer to bank accounts',
      Icon: BankIcon,
      route: WalletRoutes.SendToBank,
    },
    // {
    //   source: 'Qr Code',
    //   description: 'For bank or wallet transfers',
    //   Icon: QRIcon,
    //   route: null,
    // },
  ]

  const payMerchantData: PayToType[] = [
    {
      source: 'Pay to Till',
      Icon: BasketIcon,
      route: WalletRoutes.MerchantAmountForm,
      merchantType: 'TILL',
    },
    {
      source: 'Pay to Paybill',
      Icon: ReceiptIcon,
      route: null,
      merchantType: 'PAYBILL',
    },
  ]

  return { sendToData, payMerchantData }
}

export const useDummyData = () => {
  const dropDownData = [
    {
      label: 'Dummy 1',
      value: 'one',
    },
    {
      label: 'Dummy 2',
      value: 'two',
    },
    {
      label: 'Dummy 3',
      value: 'three',
    },
    {
      label: 'Dummy 4',
      value: 'four',
    },
  ]

  return { dropDownData }
}

export const useWalletTransferMethods = () => {
  const transferMethods = [
    {
      label: 'Bank Transfer',
      value: 'BANK_TRANSFER',
    },
    {
      label: 'Wallet Transfer',
      value: 'WALLET_TRANSFER',
    },
    {
      label: 'Mpesa',
      value: 'MPESA',
    },
  ]

  return { transferMethods }
}

export const transferFrequency = [
  { label: 'Daily', value: 'DAILY' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Quarterly', value: 'QUARTERLY' },
  { label: 'Yearly', value: 'YEARLY' },
]

export const useWalletTransferFrequencies = () => {
  return { transferFrequency }
}

export type TwpBankAccount = {
  name: string
  accName: string
  accNo: string
}

export const wpBankAccounts: TwpBankAccount[] = [
  {
    name: 'Equity Bank Limited',
    accName: 'WorkPay Africa Limited',
    accNo: '1750279969480',
  },
  {
    name: 'Kenya Commercial Bank Limited',
    accName: 'WorkPay Africa Limited',
    accNo: '1288579020',
  },
  {
    name: 'NCBA',
    accName: 'WorkPay Africa Limited',
    accNo: '8393300024',
  },
]
