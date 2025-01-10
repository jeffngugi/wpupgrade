import { useState } from 'react'
import { DropDownPickerProps } from 'react-native-dropdown-picker'

const useDropdown = <T>(initialValue: T | null = null) => {
  const [value, setValue] = useState<T | null>(initialValue)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<DropDownPickerProps<T>['items']>([])

  // Memoize the handlers to avoid unnecessary re-renders
  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)
  const onChangeValue = (val: T | null) => setValue(val)

  const setDropdownItems = (newItems: DropDownPickerProps<T>['items']) =>
    setItems(newItems)

  return {
    value,
    open,
    items,
    onOpen,
    onClose,
    onChangeValue,
    setDropdownItems,
    setValue, // Expose setValue
  }
}

export default useDropdown
