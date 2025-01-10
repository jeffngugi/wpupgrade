import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react'
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { Box, HStack, Pressable, Text } from 'native-base'
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet'
import {
  Controller,
  Control,
  RegisterOptions,
  UseFormSetValue,
} from 'react-hook-form'
import SearchInput from '~components/SearchInput'
import Check from '~assets/svg/check.svg'
import { windowHeight } from '~utils/appConstants'
import CommonInputCurrency from './CommonInputCurrency'
import FlagAvatar from '~components/FlagAvatar'
import { isNull } from 'lodash'

interface Option {
  label: string
  value: string
}

interface ActionSheetInputProps {
  control: Control<any>
  name: string
  rules?: RegisterOptions
  options: Option[]
  label?: string
  placeholder?: string
  defaultValue?: string
  setValue: UseFormSetValue<any>
  searchable?: boolean
  loading?: boolean
  searchPlaceholder?: string
  searchText?: string
  onSearchText?: (text: string) => void //This to be passed when filtering from parent component
  empCurrencyCode?: string
  disableCurrency?: boolean
}

const ActionSheetPickerCurrencies: React.FC<ActionSheetInputProps> = ({
  control,
  name,
  rules,
  options,
  label,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search',
  defaultValue,
  setValue,
  searchable,
  loading,
  searchText,
  onSearchText,
  empCurrencyCode,
  disableCurrency,
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null)
  const [selectedCurrencyItem, setSelectedCurrencyItem] = useState<any>(null)

  const openActionSheet = () => actionSheetRef.current?.show()
  const closeActionSheet = () => actionSheetRef.current?.hide()

  const disabledLocalSearch = Boolean(onSearchText)

  const [query, setQuery] = useState(searchText || '')


  useEffect(() => {
    if (!isNull(empCurrencyCode)) {
      const currency = options?.find((item) => item?.code === empCurrencyCode)
      setSelectedCurrencyItem(currency)
      setValue?.('currency', currency?.value)
    }
  }, [empCurrencyCode])

  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue)
    }
  }, [defaultValue, name, setValue])

  const _items = useMemo(() => {
    if (disabledLocalSearch) {
      return options
    }
    return options?.filter(item =>
      item.label
        .toLocaleLowerCase('en')
        .includes(query.toLocaleLowerCase('en')),
    )
  }, [options, query])

  const onLocalSearch = (text: string) => {
    setQuery(text)
  }

  const _renderItem = useCallback(
    (
      { item }: { item: Option },
      value: string,
      onChange: (value: string) => void,
    ) => (
      <Pressable
        flexDirection="row"
        justifyContent="space-between"
        disabled={disableCurrency}
        paddingY="12px"
        backgroundColor={item.value === value ? 'green.10' : null}
        onPress={() => {
          onChange(item.value)
          setSelectedCurrencyItem(item)
          closeActionSheet()
          setQuery('')
        }}>
        <HStack alignItems="center" width="100%" justifyContent="flex-start">
          <FlagAvatar
            width={'40px'}
            url={item?.flag}
            fallback={item.label}
          />

          <Text
            fontSize="16px"
            lineHeight="20px"
            pl={'10px'}
            color={item.value === value ? 'green.50' : 'charcoal'}>
            {item.label}
          </Text>
          {item.value === value ? <Check /> : <Box />}
        </HStack>
      </Pressable>
    ),
    [],
  )

  const _listHeaderComponent = useCallback(
    () => (
      <Box
        flexDirection="row"
        width="100%"
        alignItems="center"
        marginBottom="20px">
        <SearchInput
          borderWidth={0}
          handleSearch={onSearchText ? onSearchText : onLocalSearch}
          placeholder={searchPlaceholder}
        />
      </Box>
    ),
    [loading],
  )



  const _loaderComponent = () => (

    <ActivityIndicator
      size={70}
      style={{ marginVertical: 30 }}
      color="#999999"

    />
  )

  const _listEmptyComponent = useCallback(
    () => (
      loading ?
        _loaderComponent()
        : (
          <Box width="100%" alignItems="center" marginBottom="20px" paddingY="40px">
            <Text fontFamily="heading" fontSize="18px">
              Sorry, nothing to show!
            </Text>
          </Box>
        )
    ),
    [loading],
  )

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box marginBottom="10px">

          <CommonInputCurrency
            label={label}
            placeholder={placeholder}
            keyboardType="default"
            name={'amount'}
            control={control}
            rules={rules}
            secure={false}
            password={false}
            inputProps={{}}
            currencies={[]}
            openActionSheet={openActionSheet}
            currencyItem={selectedCurrencyItem}
            disableCurrency={disableCurrency}
          />

          {error && <Text style={styles.errorText}>{error.message}</Text>}

          <ActionSheet ref={actionSheetRef} containerStyle={styles.actionSheet}>
            <SafeAreaView style={styles.actionSheetContent}>
              <Box paddingX="16px" marginY="15px" marginTop="20px">
                <Box
                  alignItems="center"
                  flexDirection="row"
                  justifyContent="space-between"
                  marginBottom="15px">
                  <Text
                    fontSize="20px"
                    lineHeight="30px"
                    textAlign="center"
                    color="charcoal">
                    {label || 'Select an option'}
                  </Text>
                  <Pressable
                    alignItems="center"
                    onPress={closeActionSheet}
                    alignSelf="flex-end">
                    <Text style={styles.closeButton}>✕</Text>
                  </Pressable>
                </Box>
                {searchable ? _listHeaderComponent() : null}
                <FlatList
                  data={_items}
                  renderItem={({ item }) =>
                    _renderItem({ item }, value, onChange)
                  }
                  keyExtractor={(_, index) => index.toString()}

                  ListEmptyComponent={_listEmptyComponent}

                />
                {/* )} */}
              </Box>
            </SafeAreaView>
          </ActionSheet>
        </Box>
      )}
    />
  )
}
const styles = StyleSheet.create({
  input: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'moderat-medium',
    height: 42,
    borderWidth: 1,
    color: '#253545',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  inputText: {
    fontSize: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  actionSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionSheetContent: {
    maxHeight: windowHeight * 0.75,
  },
  closeButton: {
    fontSize: 24,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedOptionItem: {
    backgroundColor: '#ADDE98',
  },
  optionText: {
    fontSize: 16,
  },
})

export default ActionSheetPickerCurrencies
