import React from 'react'
import { Box, Pressable, Text } from 'native-base'
import { contactColors } from '~constants/Colors'
import useContacts, { IPhoneContact } from '~utils/phoneContacts'
import SearchInput from '~components/SearchInput'
import { debounce } from 'lodash'
import { FlashList } from '@shopify/flash-list'

type Props = {
  onPress: (item: any) => void
  searchPlaceholder?: string
}

const WalletContacts = ({ onPress, searchPlaceholder }: Props) => {
  const { loading, contacts } = useContacts()
  const [searchText, setSearchText] = React.useState('')
  const [filteredContacts, setFilteredContacts] = React.useState<
    IPhoneContact[]
  >([])

  React.useEffect(() => {
    if (!searchText) {
      setFilteredContacts(contacts)
      return
    }
    setFilteredContacts(
      contacts.filter(
        contact =>
          contact.givenName.toLowerCase().includes(searchText.toLowerCase()) ||
          contact.phoneNumber.includes(searchText),
      ),
    )
  }, [searchText, contacts])

  const ContactItem = ({
    item,
    index,
  }: {
    item: IPhoneContact
    index: number
  }) => {
    const IText = item?.givenName ? item.givenName.charAt(0) : 'WP'
    return (
      <Pressable
        flexDirection="row"
        alignItems="center"
        marginY="14px"
        onPress={() => onPress(item)}
        alignContent="center">
        <Box
          width="40px"
          height="40px"
          borderRadius="20px"
          backgroundColor={contactColors[index % contactColors.length]}
          alignItems="center"
          justifyContent="center">
          <Text fontSize="16px" color="white">
            {IText}
          </Text>
        </Box>
        <Box ml="16px">
          <Text fontSize="18px" color="charcoal" lineHeight={24}>
            {item?.givenName}
          </Text>
          <Text lineHeight={24}>{item?.phoneNumber}</Text>
        </Box>
      </Pressable>
    )
  }

  const handleSearch = (text: string) => {
    //set search text debounced
    debounce(() => {
      setSearchText(text)
    }, 300)()
  }

  return (
    <Box flex={1}>
      {loading ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="20px">Loading ...</Text>
        </Box>
      ) : (
        <>
          <Box my="4px">
            <SearchInput
              placeholder={searchPlaceholder || 'Search'}
              handleSearch={handleSearch}
            />
          </Box>

          <FlashList
            data={filteredContacts}
            keyExtractor={item => item.recordID}
            estimatedItemSize={600}
            renderItem={({ item, index }) => (
              <ContactItem item={item} index={index} />
            )}
          />
        </>
      )}
    </Box>
  )
}

export default WalletContacts
