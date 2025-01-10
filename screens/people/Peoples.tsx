import { Box, Divider, HStack, Pressable, Text } from 'native-base'
import React, { useEffect, useRef, useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import SearchInput from '../../components/SearchInput'
import UpDownSvg from '../../assets/svg/ArrowsDownUp.svg'
import GridListBtn from '../../components/GridListBtn'
import TileView from './components/TileView'
import ListView from './components/ListView'
import LoaderScreen from '~components/LoaderScreen'
import { isString, orderBy, filter, debounce, isEmpty } from 'lodash'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  PeopleRoutes,
} from '~types'
import { useGetColleagues } from '~api/people'
import { TSortedColleague } from './types'
import RBSheet from 'react-native-raw-bottom-sheet'
import PeopleFilter from './components/PeopleFilter'
import SortedTileView from './components/SortedTileView'
import SortedListView from './components/SortedListView'
import { useRoute } from '@react-navigation/native'
import { TRelieverFilter } from '~api/leave'
interface Props {
  navigation: MainNavigationProp<PeopleRoutes.Peoples>
  route: MainNavigationRouteProp<PeopleRoutes.Peoples>
}

export type TPeopleSort = {
  label: string
  value: string
}

const peopleSortItems: TPeopleSort[] = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Teammates on leave',
    value: 'leaves',
  },
  {
    label: 'Birthdays',
    value: 'birthdays',
  },
  {
    label: 'New teammates',
    value: 'new_colleagues',
  },
  {
    label: 'Work-er-verseries',
    value: 'anniversaries',
  },
]

const Peoples = ({ navigation }: Props) => {
  const filterParam = useRoute().params?.filterText
  const [gridView, setGridView] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filterText, setFilterText] = useState(filterParam ? filterParam : '')
  const handleToggle = () => setGridView(!gridView)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const refRBSheet = useRef<RBSheet | null>(null)
  const [open, setOpen] = useState(false)
  const [filteredData, setFilteredData] = useState([])

  const relieaverFilter: TRelieverFilter = {
    searchText,
    filter: filterText,
  }
  const {
    data: colleagues,
    isLoading: colleaguesLoading,
    refetch,
    isRefetching,
  } = useGetColleagues(relieaverFilter)

  const colleaguesData = colleagues?.data ?? []
  const filterColleagues = filter(colleaguesData, i => i.name != null)
  const sortedColleagues = orderBy(filterColleagues, 'name', 'asc')

  const newCData = sortedColleagues.reduce((r, e) => {
    // get first letter of name of current element
    const title = isString(e.name) ? e.name[0] : null
    // if there is no property in accumulator with this letter create it
    if (!r[title]) r[title] = { title, data: [e] }
    // // if there is push current element to children array for that letter
    else r[title].data.push(e)
    // return accumulator
    return r
  }, {})
  const colleaguesResult: TSortedColleague[] = Object.values(newCData)

  const handleSearch = (text: string) => {
    debouncedSearch(text)
  }

  useEffect(() => {
    if (filterParam === 'leaves') {
      setSelectedIndex(1)
    }
  }, [filterParam])

  const debouncedSearch = React.useRef(
    debounce(text => {
      setSearchText(text)
    }, 1000),
  ).current

  const handlePress = (selectedItem: TPeopleSort, index: number) => {
    setSelectedIndex(index)
    setFilterText(selectedItem.value)

    if (!open) {
      /* tslint:disable-next-line */
      refRBSheet.current.open()
    } else {
      /* tslint:disable-next-line */
      refRBSheet.current.close()
    }
  }

  const bottomSheetStyles = React.useMemo(() => {
    return {
      container: {
        paddingBottom: 60,
        borderTopRightRadius: 28,
        borderTopLeftRadius: 28,
        height: 'auto',
      },
    }
  }, [])

  useEffect(() => {
    const filtered = colleaguesResult
      .map(d => ({
        ...d,
        // data: d.data.filter(c => c.name === searchText.toLowerCase()),
        data: d.data.filter(c => c.name.includes(searchText)),
      }))
      .filter(d => d.data.length)
    if (searchText === '') {
      return setFilteredData(colleaguesResult)
    }
    setFilteredData(filtered)
  }, [searchText])

  return (
    <Box safeArea flex={1} backgroundColor="white">
      <Box marginX="16px">
        <ScreenHeader title="People" onPress={() => navigation.goBack()} />
        <Box mt={'24px'} />
        <SearchInput
          placeholder="Search employees"
          handleSearch={handleSearch}
        />
      </Box>
      <Box>
        <HStack
          justifyContent="space-between"
          marginX="16px"
          marginBottom="14px"
          marginTop="22px">
          <Pressable
            flexDirection="row"
            onPress={() => refRBSheet.current?.open()}
            justifyContent={'flex-start'}
            alignItems={'flex-end'}>
            <UpDownSvg width={24} height={24} color="#536171" />
            <Box h={'24px'} pt={'3px'}>
              <Text fontSize="16px" color={'grey'}>
                {peopleSortItems[selectedIndex ?? 0].label}
              </Text>
            </Box>
          </Pressable>
          <GridListBtn gridView={gridView} onPress={handleToggle} />
        </HStack>
        <Divider />
      </Box>
      {colleaguesLoading ? (
        <LoaderScreen />
      ) : (
        <Box px="16px" pt="24px" flex={1}>
          {filterText.length > 0 ? (
            gridView ? (
              <SortedTileView
                data={colleaguesData}
                refetch={refetch}
                isRefetching={isRefetching}
              />
            ) : (
              <SortedListView
                data={colleaguesData}
                filterText={filterText}
                refetch={refetch}
                isRefetching={isRefetching}
              />
            )
          ) : null}
          {filterText.length < 1 ? (
            gridView ? (
              <TileView
                sections={
                  !isEmpty(filteredData) ? filteredData : colleaguesResult
                }
                refetch={refetch}
                isRefetching={isRefetching}
              />
            ) : (
              <ListView
                data={!isEmpty(filteredData) ? filteredData : colleaguesResult}
                refetch={refetch}
                isRefetching={isRefetching}
              />
            )
          ) : null}
        </Box>
      )}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        closeOnPressMask={true}
        customStyles={bottomSheetStyles}>
        <PeopleFilter
          peoples={peopleSortItems}
          onPress={handlePress}
          selectedIndex={selectedIndex}
        />
      </RBSheet>
    </Box>
  )
}

export default Peoples
