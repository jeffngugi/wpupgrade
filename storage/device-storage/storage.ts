import AsyncStorage from '@react-native-async-storage/async-storage'
import { serialize, deserialize } from './serialize'

export function setItem<V>(key: string, value: V): Promise<void> {
  return AsyncStorage.setItem(key, serialize(value))
}

export function getItem<V>(key: string): Promise<V | null> {
  return AsyncStorage.getItem(key).then(deserialize) as Promise<V | null>
}

export function deleteItem(key: string): Promise<void> {
  return AsyncStorage.removeItem(key)
}
