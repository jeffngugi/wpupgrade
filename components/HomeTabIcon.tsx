import React from 'react'
import HomeIcon from '../assets/svg/home.svg'
import HomeSolidIcon from '../assets/svg/home-solid.svg'
import MenuIcon from '../assets/svg/menu.svg'
import AccountIcon from '../assets/svg/account.svg'
import AccountSolidIcon from '../assets/svg/account-solid.svg'
import WalletIcon from '../assets/svg/wallet.svg'
import WalletSolidIcon from '../assets/svg/wallet-solid.svg'

type HomeTabProps = {
  focused: boolean
  name: string
}

const HomeTabIcon = ({ focused, name }: HomeTabProps) => {
  let TabIcon = MenuIcon
  if (name === 'Home') {
    TabIcon = focused ? HomeSolidIcon : HomeIcon
  } else if (name === 'Wallet') {
    TabIcon = focused ? WalletSolidIcon : WalletIcon
  } else if (name === 'Menu') {
    TabIcon = MenuIcon
  } else if (name === 'Account') {
    TabIcon = focused ? AccountSolidIcon : AccountIcon
  }

  return <TabIcon color={focused ? '#62A446' : '#536171'} />
}

export default HomeTabIcon
