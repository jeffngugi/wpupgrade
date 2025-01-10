import { debounce } from 'lodash'
import { useState, useRef } from 'react'

type UseDebouncedSearchReturn = [string, (text: string) => void]

export const useDebouncedSearch = (
  initialValue: string,
  delay: number,
): UseDebouncedSearchReturn => {
  const [searchText, setSearchText] = useState<string>(initialValue)

  // Create a debounced version of the setSearchText function
  const debouncedSetSearchText = useRef(
    debounce((text: string) => {
      setSearchText(text)
    }, delay),
  ).current

  const handleSearch = (text: string) => {
    debouncedSetSearchText(text)
  }

  return [searchText, handleSearch]
}
