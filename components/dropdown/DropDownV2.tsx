import React, { useEffect } from 'react'
import { Control, Controller } from 'react-hook-form'
import DropDownPicker, {
  DropDownPickerProps,
} from 'react-native-dropdown-picker'
import useDropdown from './useDropDown'
import { StyleSheet } from 'react-native'
import { Text } from 'native-base'

interface DropdownInputProps<T> {
  control: Control<any>
  name: string
  rules?: object
  items: DropDownPickerProps<T>['items']
  placeholder?: string
  setValue: (value: T) => void
  onSearchText?: (text: string) => void
  zIndex?: number
  loading?: boolean
  searchable?: boolean
  categorySelectable?: boolean
  label: string
  disabled?: boolean
}

const DropdownInputV2 = <T,>({
  control,
  name,
  rules,
  items,
  placeholder,
  setValue,
  onSearchText,
  zIndex,
  loading,
  searchable,
  categorySelectable,
  label,
  disabled = false,
}: DropdownInputProps<T>) => {
  const { value, open, onOpen, onClose, onChangeValue, setDropdownItems } =
    useDropdown<T>()

  useEffect(() => {
    setDropdownItems(items)
  }, [items])

  useEffect(() => {
    if (setValue) {
      setValue(value)
    }
  }, [value])

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value, ref }, formState: { errors } }) => (
        <>
          <Text
            fontFamily={'body'}
            fontSize={'14px'}
            mb={'8px'}
            color={'grey'}
            lineHeight="22px">
            {label}
          </Text>
          <DropDownPicker
            listMode="SCROLLVIEW"
            ref={ref}
            onChangeSearchText={onSearchText}
            disableLocalSearch={onSearchText ? true : false}
            zIndex={zIndex ? zIndex : 1000}
            open={open}
            value={value}
            items={items}
            setOpen={onOpen}
            setValue={onChangeValue}
            setItems={setDropdownItems}
            theme="LIGHT"
            loading={loading}
            searchable={searchable}
            onChangeValue={(val: T | null) => {
              onChange(val)
              onChangeValue(val)
            }}
            placeholder={placeholder ?? 'Select'}
            onClose={onClose}
            searchPlaceholder="Search..."
            placeholderStyle={styles.placeholderStyle}
            searchTextInputStyle={styles.searchTextInputStyle}
            selectedItemContainerStyle={styles.selectedItemContainer}
            listItemLabelStyle={styles.listItemLabelStyle}
            labelStyle={styles.listItemLabelStyle}
            dropDownContainerStyle={styles.dropDownContainer}
            categorySelectable={categorySelectable}
            searchWithRegionalAccents={false}
            searchContainerStyle={{
              backgroundColor: 'white',
              ...styles.inputContainer,
            }}
            style={[
              {
                borderColor: errors[name]
                  ? '#F14B3B'
                  : disabled ?
                    '#E4E5E7' :
                    open
                      ? '#62A446'
                      : '#BBBFC4',
              },

              styles.inputContainer,
            ]}
            disabled={disabled}
          />
          {errors[name] ? (
            <Text color="red.50" mt={'5px'}>
              {errors[name]?.message as React.ReactNode ?? 'This field is required'}
            </Text>
          ) : null}
        </>
      )}
    />
  )
}

export default DropdownInputV2

const styles = StyleSheet.create({
  inputContainer: {
    height: 48,
    borderRadius: 4,
  },
  dropDownContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E5E7',
    borderRadius: 4,
  },
  searchTextInputStyle: {
    backgroundColor: '#F0F4F9',
    borderRadius: 2,
    borderColor: '#DBE6F5',
    fontSize: 20,
    fontFamily: 'moderat-regular',
  },
  placeholderStyle: {
    color: '#B6CCD7',
    fontFamily: 'moderat-regular',
    fontSize: 16,
    lineHeight: 18,
  },
  listItemLabelStyle: {
    fontFamily: 'moderat-regular',
    fontSize: 16,
    lineHeight: 18,
    color: '#253545',
  },
  selectedItemContainer: {
    backgroundColor: '#F1FDEB',
    height: 48,
  },
})
