import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react'
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { Box, Pressable, Text } from 'native-base'
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet'
import {
  Controller,
  Control,
  RegisterOptions,
  UseFormSetValue,
} from 'react-hook-form'
import SearchInput from '~components/SearchInput'
import Check from '~assets/svg/check.svg'
import ChevDown from '~assets/svg/chevron-down-2.svg'
import { windowHeight } from '~utils/appConstants'

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
}

const ActionSheetPicker: React.FC<ActionSheetInputProps> = ({
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
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null)

  const openActionSheet = () => actionSheetRef.current?.show()
  const closeActionSheet = () => actionSheetRef.current?.hide()

  const disabledLocalSearch = Boolean(onSearchText)

  const [query, setQuery] = useState(searchText || '')

  console.log(query, 'query', searchText, 'searchText')

  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue)
    }
  }, [defaultValue, name, setValue])

  const _items = useMemo(() => {
    if (disabledLocalSearch) {
      return options
    }
    return options.filter(item =>
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
        paddingY="12px"
        backgroundColor={item.value === value ? 'green.10' : null}
        onPress={() => {
          onChange(item.value)
          closeActionSheet()
          setQuery('')
        }}>
        <Text
          fontSize="16px"
          lineHeight="20px"
          color={item.value === value ? 'green.50' : 'charcoal'}>
          {item.label}
        </Text>
        {item.value === value ? <Check /> : <Box />}
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
          {label && <Text marginBottom="8px">{label}</Text>}
          <TouchableOpacity onPress={openActionSheet}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: error ? 'red' : '#BBBFC4',
                },
                { height: 48, fontFamily: 'moderat-regular', fontSize: 16 },
              ]}
              value={
                value
                  ? options.find(option => option.value === value)?.label
                  : undefined
              }
              placeholder={placeholder}
              onTouchStart={openActionSheet}
              pointerEvents="none"
              placeholderTextColor={'#BBBFC4'}
              editable={false}
            />
            <ChevDown
              width={20}
              height={20}
              color="#BBBFC4"
              style={{ position: 'absolute', right: 16, top: 16 }}
            />
          </TouchableOpacity>

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

export default ActionSheetPicker
