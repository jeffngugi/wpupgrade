import { isArray } from 'lodash'

/**
 *
 * @param arr This is the array of object you want to convert
 * @param id key from @arr you want to convert to value
 * @param name key from @arr you want to convert to 'label'
 * @returns array of objects or empty arr
 */
export const createPickerItems = (arr: unknown[], id: string, name: string) => {
  try {
    if (isArray(arr)) {
      const items = arr.map(item => ({
        value: item[id],
        label: item[name],
        ...item,
      }))

      return items
    }
    return []
  } catch (error) {
    return []
  }
}
