import { StyleSheet } from 'react-native'
import React from 'react'
import { Pressable, Box, HStack, Text } from 'native-base'
import BackSpaceIcon from '~assets/svg/back-space.svg'
import FingerPrintSvg from '~assets/svg/fingerprint.svg'
import FaceIdIcon from '~assets/svg/face-id.svg'
import { noop } from 'lodash'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
interface Props {
  handleDigitPress: (digit: number) => void
  onBackspacePress: () => void
  onBackspaceLongPress?: () => void
  onBiometricPress?: (digit: number) => void
  showBiometric?: boolean
}

const PadButton = ({
  digit,
  onDigitPress,
  icon,
}: {
  digit: number
  onDigitPress: (digit: number) => void
  icon?: React.ReactNode
}) => {
  const onPress = () => onDigitPress(digit)

  return (
    <Pressable
      backgroundColor="#F0FBEA"
      rounded="full"
      onPress={onPress}
      alignItems="center"
      justifyContent="center"
      width="70px"
      height="70px"
      borderWidth={1}
      borderColor="green.30">
      {icon ? (
        icon
      ) : (
        <Text fontSize="30px" color="green.70">
          {digit}
        </Text>
      )}
    </Pressable>
  )
}

const NumberKeypad = ({
  handleDigitPress,
  onBackspacePress,
  onBiometricPress,
  showBiometric = true,
}: Props) => {
  const { biometricEnabled, faceIdEnabled, lockPinAvailable } = useSelector(
    (state: State) => state.application,
  )
  return (
    <Box
      width="100%"
      alignContent="center"
      justifyContent="center"
      paddingX="10px">
      <HStack style={styles.row}>
        <PadButton digit={1} onDigitPress={handleDigitPress} />
        <PadButton digit={2} onDigitPress={handleDigitPress} />
        <PadButton digit={3} onDigitPress={handleDigitPress} />
      </HStack>
      <HStack style={styles.row}>
        <PadButton digit={4} onDigitPress={handleDigitPress} />
        <PadButton digit={5} onDigitPress={handleDigitPress} />
        <PadButton digit={6} onDigitPress={handleDigitPress} />
      </HStack>
      <HStack style={styles.row}>
        <PadButton digit={7} onDigitPress={handleDigitPress} />
        <PadButton digit={8} onDigitPress={handleDigitPress} />
        <PadButton digit={9} onDigitPress={handleDigitPress} />
      </HStack>
      <HStack style={styles.row}>
        {showBiometric ? (
          biometricEnabled && lockPinAvailable ? (
            <PadButton
              icon={<FingerPrintSvg color="#387E1B" />}
              digit={0}
              onDigitPress={() => onBiometricPress?.(0) || noop()}
            />
          ) : faceIdEnabled && lockPinAvailable ? (
            <PadButton
              icon={<FaceIdIcon color="#387E1B" />}
              digit={0}
              onDigitPress={() => onBiometricPress?.(0) || noop()}
            />
          ) : (
            <Box width="70px" height="70px" />
          )
        ) : (
          <Box width="70px" height="70px" />
        )}
        <PadButton digit={0} onDigitPress={handleDigitPress} />
        <Pressable
          backgroundColor="#F0FBEA"
          rounded="full"
          onPress={onBackspacePress}
          alignItems="center"
          justifyContent="center"
          width="70px"
          height="70px"
          borderWidth={1}
          borderColor="green.30">
          <BackSpaceIcon color="#387E1B" />
        </Pressable>
      </HStack>
    </Box>
  )
}

export default NumberKeypad

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
})
