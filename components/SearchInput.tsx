import { Input } from 'native-base'
import React from 'react'
import SearchIcon from '../assets/svg/search.svg'
import { ResponsiveValue } from 'native-base/lib/typescript/components/types'

type Props = {
  handleSearch: (search: string) => void
  placeholder: string
  borderWidth?: ResponsiveValue<
    (string & {}) | (number & {}) | '0' | '1' | '2' | '4' | '8'
  >
}

const SearchInput = ({ handleSearch, placeholder, borderWidth }: Props) => {
  return (
    <Input
      borderRadius="4px"
      fontSize={'16px'}
      backgroundColor="sea.10"
      borderWidth={borderWidth ?? '1px'}
      w={{
        base: '100%',
        md: '25%',
      }}
      h={'48px'}
      InputLeftElement={
        <SearchIcon
          color="#536171"
          width={'24px'}
          height={'24px'}
          style={{ marginLeft: 10 }}
        />
      }
      placeholder={placeholder}
      onChangeText={handleSearch}
    />
  )
}

export default SearchInput
