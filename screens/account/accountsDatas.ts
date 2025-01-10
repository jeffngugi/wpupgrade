import UserIcon from '~assets/svg/account.svg'
import EmploymentIcon from '~assets/svg/employment.svg'
import PeopleIcon from '~assets/svg/people.svg'
import LockIcon from '~assets/svg/lock.svg'
import SupportIcon from '~assets/svg/support.svg'
import LogoutIcon from '~assets/svg/logout.svg'
import RefreshIcon from '~assets/svg/refresh.svg'
import FingerIcon from '~assets/svg/fingerprint.svg'
import DocumentsIcon from '~assets/svg/documents-accounts.svg'
import WalletIcon from '~assets/svg/wallet-setting.svg'
import WalletLockIcon from '~assets/svg/wallet-lock.svg'
import WalletBellIcon from '~assets/svg/wallet-bell.svg'
import StarIcon from '~assets/svg/wallet-star.svg'
import WalletBankIcon from '~assets/svg/wallet-bank.svg'
import XIcon from '~assets/svg/wallet-x.svg'
import DollarIcon from '~assets/svg/dollar-icon.svg'
// import LanguageIcon from '~assets/svg/translate.svg'
import {
  AccountSectionItemType,
  AccountSectionTypes,
  AccountsRoutes,
  WalletRoutes,
} from '~types'
import ManagePinIcon from '~assets/svg/manage-pin.svg'
import FaceIDIcon from '~assets/svg/face-id-mini.svg'
// import LanguageIcon from '~assets/svg/translate.svg'
import { Platform } from 'react-native'
import { useAccountSettings } from '~api/settings'

export const walletSettingData: AccountSectionItemType[] = [
  {
    Icon: UserIcon,
    label: 'Wallet Profile',
    route: WalletRoutes.Profile,
  },
  {
    Icon: WalletLockIcon,
    label: 'Security',
    route: WalletRoutes.Security,
  },
  {
    Icon: WalletBellIcon,
    label: 'Notifications',
    route: WalletRoutes.Notifications,
  },
  {
    Icon: PeopleIcon,
    label: 'Saved Beneficiaries',
    route: WalletRoutes.Beneficiaries,
  },
  {
    Icon: RefreshIcon,
    label: 'Recurring payments',
    route: WalletRoutes.RecurringPayment,
  },
  {
    Icon: StarIcon,
    label: 'Transaction Categories',
    route: WalletRoutes.TransactionCategories,
  },
  {
    Icon: WalletBankIcon,
    label: 'Linked Accounts',
    route: WalletRoutes.LinkedAccounts,
  },
  {
    Icon: DollarIcon,
    label: 'Receive your salary to your wallet',
    route: null,
  },
  {
    Icon: XIcon,
    label: 'Opt out of Wallet',
    route: WalletRoutes.OptOut,
    id: 'optOut',
  },
]

export const useAccountData = () => {
  const { data: settingData } = useAccountSettings()
  const allowP9Form = Boolean(settingData?.data?.download_p9_forms)

  const accountsDatas: AccountSectionTypes[] = [
    {
      title: '',
      data: [
        {
          Icon: UserIcon,
          label: 'Profile',
          route: AccountsRoutes.Profile,
        },
        {
          Icon: EmploymentIcon,
          label: 'Employment Details',
          route: AccountsRoutes.EmploymentDetail,
        },
        {
          Icon: PeopleIcon,
          label: 'Contact Persons',
          route: AccountsRoutes.ContactPerson,
        },
        ...(allowP9Form
          ? [
              {
                Icon: DocumentsIcon,
                label: 'P9 Forms',
                route: AccountsRoutes.P9Forms,
              },
            ]
          : []),
        {
          Icon: WalletIcon,
          label: 'Wallet Settings',
          route: WalletRoutes.Setting,
        },
      ],
    },
    {
      title: 'Security',
      data: [
        {
          Icon: FingerIcon,
          label: 'Touch ID Login',
          route: null,
        },
        ...(Platform.OS === 'ios'
          ? [{ Icon: FaceIDIcon, label: 'Face ID Login', route: null }]
          : []),
        {
          Icon: ManagePinIcon,
          label: 'Manage Pin',
          route: AccountsRoutes.MananagePin,
        },
        {
          Icon: LockIcon,
          label: 'Change Password',
          route: AccountsRoutes.AccountPassword,
        },
      ],
    },
    {
      title: 'Preferences',
      data: [
        // {
        //   Icon: LanguageIcon,
        //   label: 'Language',
        //   route: null,
        // },
        {
          Icon: RefreshIcon,
          label: 'Switch Company',
          route: AccountsRoutes.SwitchCompany,
        },
      ],
    },
    {
      title: 'About',
      data: [
        {
          Icon: SupportIcon,
          label: 'Support',
          route: AccountsRoutes.Support,
        },
        {
          Icon: LogoutIcon,
          label: 'Log Out',
          route: null,
        },
        {
          Icon: LogoutIcon,
          label: 'Version',
          route: null,
        },
      ],
    },
  ]

  const getAccountDatas = (walletEnabled: boolean) => {
    if (walletEnabled) {
      return accountsDatas
    }

    return accountsDatas.map((section: AccountSectionTypes) => {
      if (section.title === '') {
        return {
          ...section,
          data: section.data.filter(
            (item: AccountSectionItemType) => item.label !== 'Wallet Settings',
          ),
        }
      }

      return section
    })
  }

  return { accountsDatas, getAccountDatas }
}
