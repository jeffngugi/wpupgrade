import React, { Dispatch, ReactNode, SetStateAction } from 'react'
import { StyleSheet } from 'react-native'
import DownPicker from 'react-native-dropdown-picker'
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form'
import { Text } from 'native-base'

export type optionsType = { label: string; value: string; parent?: string }

type Props<T extends FieldValues = FieldValues, U = any> = {
  value: string
  open: boolean
  options: optionsType[]
  setOptions: Dispatch<SetStateAction<optionsType[]>>
  setValue: Dispatch<SetStateAction<string>>
  setOpen: Dispatch<React.SetStateAction<boolean>>
  control: Control<T, U>
  rules: RegisterOptions
  name: Path<T>
  zIndex?: number
  loading?: boolean
  searchable?: boolean
  categorySelectable?: boolean
  searchPlaceholder?: string
  onSearchText?: (text: string) => void
}

const DropDownPicker = <T extends FieldValues = FieldValues, U = any>({
  open,
  options,
  value,
  setOptions,
  setOpen,
  setValue,
  loading,
  searchable,
  searchPlaceholder,
  control,
  rules,
  name,
  zIndex,
  categorySelectable,
  onSearchText,
}: Props<T, U>) => {
  return (
    <Controller
      name={name}
      // defaultValue=""
      rules={{ ...rules }}
      control={control}
      render={({ field: { onChange }, formState: { errors } }) => (
        <>
          <DownPicker
            listMode="SCROLLVIEW"
            onChangeSearchText={onSearchText}
            disableLocalSearch={onSearchText ? true : false}
            zIndex={zIndex ? zIndex : 1000}
            open={open}
            value={value}
            items={options}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setOptions}
            theme="LIGHT"
            loading={loading}
            searchable={searchable}
            onChangeValue={onChange}
            searchPlaceholder={searchPlaceholder ?? 'Select'}
            placeholderStyle={styles.placeholderStyle}
            // selectedItemLabelStyle={styles.listItemLabelStyle}
            searchTextInputStyle={styles.searchTextInputStyle}
            selectedItemContainerStyle={styles.selectedItemContainer}
            listItemLabelStyle={styles.listItemLabelStyle}
            labelStyle={styles.listItemLabelStyle}
            dropDownContainerStyle={styles.dropDownContainer}
            categorySelectable={categorySelectable}
            searchContainerStyle={{
              backgroundColor: '#F0F4F9',
              ...styles.inputContainer,
            }}
            style={[
              {
                borderColor: errors[name]
                  ? '#F14B3B'
                  : open
                  ? '#62A446'
                  : '#BBBFC4',
              },

              styles.inputContainer,
            ]}
          />
          {errors[name] ? (
            <Text color="red.50" mt={'5px'}>
              {(errors[name]?.message as ReactNode) ?? 'This field is required'}
            </Text>
          ) : null}
        </>
      )}
    />
  )
}

export default DropDownPicker

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
    fontSize: 16,
    fontFamily: 'moderat-regular',
  },
  placeholderStyle: {
    color: '#BBBFC4',
    fontFamily: 'moderat-regular',
    fontSize: 16,
    lineHeight: 24,
  },
  listItemLabelStyle: {
    fontFamily: 'moderat-regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#253545',
  },
  selectedItemContainer: {
    backgroundColor: '#F1FDEB',
    height: 48,
  },
})
