import React, { useState } from 'react'
import WalletHome from './home/WalletHome'
import WalletWelcome from './opt-in/WalletWelcome'
import { useWalletStatus } from './hooks/useWalletStatus'
import { useGetWalletUser } from '~api/wallet'
import LoaderScreen from '~components/LoaderScreen'

const WalletScreen = () => {
  const { isActive } = useWalletStatus()
  const { isLoading: walletLoading } = useGetWalletUser()

  if (walletLoading) {
    return <LoaderScreen />
  }

  if (isActive) {
    return <WalletHome />
  }
  return <WalletWelcome />
}

export default WalletScreen
