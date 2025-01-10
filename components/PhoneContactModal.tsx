import { Modal, ModalProps } from 'react-native'
import React from 'react'
import { Box, Text, FlatList, Pressable } from 'native-base'
import ScreenHeader from './ScreenHeader'
import SearchInput from './SearchInput'
import { contactColors } from '~constants/Colors'
import { FlashList } from '@shopify/flash-list'

interface Props extends ModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  contacts: []
  onPressContact: any
  handleSearchContact: (search: string) => void
}

const PhoneContactModal = ({
  visible,
  setVisible,
  contacts,
  onPressContact,
  handleSearchContact,
}: Props) => {
  const PhoneContactItem = ({ item, index }) => {
    const IText = item?.givenName ? item.givenName.charAt(0) : 'U'

    return (
      <Pressable
        flexDirection="row"
        alignItems="center"
        marginY="14px"
        onPress={() => onPressContact(item.phoneNumber)}>
        <Box
          width="40px"
          height="40px"
          borderRadius="20px"
          backgroundColor={contactColors[index % contactColors.length]}
          alignItems="center"
          justifyContent="center">
          <Text fontSize="16px">{IText}</Text>
        </Box>
        <Box ml="16px">
          <Text fontSize="18px" color="charcoal">
            {item?.givenName}
          </Text>
          <Text>{item?.phoneNumber}</Text>
        </Box>
      </Pressable>
    )
  }

  return (
    <Modal animationType="fade" visible={visible}>
      <Box flex={1} paddingX="16px">
        <ScreenHeader title="All Contact" onPress={() => setVisible(false)} />
        <Box marginY="4px" />
        <SearchInput
          placeholder="search contact"
          handleSearch={handleSearchContact}
        />
        <FlashList
          data={contacts}
          renderItem={PhoneContactItem}
          estimatedItemSize={600}
        />
      </Box>
    </Modal>
  )
}

export default PhoneContactModal
