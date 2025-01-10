import * as SecureStore from 'expo-secure-store'

export enum SecureStorageKeys {
  PIN = 'pin',
  LAST_IDLE = 'lastIdle',
}

export type SecureStorageKeyTypes = `${SecureStorageKeys}`

export const storeSecureItem = (key: SecureStorageKeyTypes, value: string) =>
  SecureStore.setItemAsync(key, value)

export const getSecureItem = (key: SecureStorageKeyTypes) =>
  SecureStore.getItemAsync(key)

export const deleteSecureItem = (key: SecureStorageKeyTypes) =>
  SecureStore.deleteItemAsync(key)

export const signOutSecureStore = () => [
  SecureStore.deleteItemAsync(SecureStorageKeys.PIN),
]
