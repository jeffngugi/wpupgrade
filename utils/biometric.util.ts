import * as LocalAuthentication from 'expo-local-authentication'

export const checkHasHardwareAsync = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  if (!hasHardware) {
    return false
  }
  return true
}

export const supportsFaceId = async () => {
  const hasFaceId =
    await LocalAuthentication.supportedAuthenticationTypesAsync()
  return hasFaceId.includes(2)
}

export const supportsFingerPrint = async () => {
  const hasFingerPrint =
    await LocalAuthentication.supportedAuthenticationTypesAsync()
  return hasFingerPrint.includes(1)
}

export const isEnrolledAsync = async () => {
  const isEnrolled = await LocalAuthentication.isEnrolledAsync()
  return isEnrolled
}
