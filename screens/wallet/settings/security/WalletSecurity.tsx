import React, { useState } from 'react'
import ScreenHeader from '~components/ScreenHeader'
import ScreenContainer from '~components/ScreenContainer'
import { Box, Divider, Pressable, Switch, Text } from 'native-base'
import CheVRight from '~assets/svg/chev-right.svg'
import { WalletRoutes } from '~types'
const WalletSecurity = ({ navigation }) => {
  const [haveBiometric, setHaveBiometrics] = useState(false)

  const handleBiometrics = () => {
    setHaveBiometrics(!haveBiometric)
  }

  const WalletSecurityItem = ({
    label,
    isSwitch,
    onPress,
  }: {
    label: string
    isSwitch?: boolean
    onPress: () => void
  }) => {
    return (
      <Pressable
        flexDirection="row"
        alignItems="center"
        paddingY="20px"
        disabled={isSwitch}
        onPress={onPress}>
        <Box mr={'auto'}>
          <Text fontSize="16px" color={'charcoal'}>
            {label}
          </Text>
        </Box>
        {isSwitch ? (
          <Switch isChecked={haveBiometric} onToggle={handleBiometrics} />
        ) : (
          <CheVRight color="#62A446" />
        )}
      </Pressable>
    )
  }

  return (
    <ScreenContainer>
      <ScreenHeader onPress={() => navigation.goBack()} title="Security" />
      <Box my="16px" />
      <WalletSecurityItem
        label="Change Wallet PIN"
        onPress={() => navigation.navigate(WalletRoutes.WalletPinChange)}
      />
      <Divider />
      <WalletSecurityItem
        label="Two-Factor Authentication"
        onPress={() => navigation.navigate(WalletRoutes.TwoFA)}
      />
      <Divider />
      {/* <WalletSecurityItem
        label="Use Biometrics for transactions"
        isSwitch
        onPress={noop}
      /> */}
    </ScreenContainer>
  )
}

export default WalletSecurity
