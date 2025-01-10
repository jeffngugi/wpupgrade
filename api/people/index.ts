import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { isEmpty } from 'lodash'
import { useSelector } from 'react-redux'
import { peopleQKeys } from '~api/QueryKeys'
import { State } from '~declarations'

export type TPeopleFilters = {
  filter: string
  searchText: string
}

const getColleagues = async (
  filters: TPeopleFilters,
  employee_id: string | number,
) => {
  const { filter, searchText } = filters
  const { data } = await axios.get('hrm/people', {
    params: {
      filter,
      employee_id,
      searchText,
      recordsPerPage: 100,
      searching: !isEmpty(searchText),
      ...(!isEmpty(searchText) && { searchText: searchText }),
    },
  })
  return data
}

export const useGetColleagues = (filters: TPeopleFilters) => {
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const data = useQuery([...peopleQKeys.colleagues, filters], () =>
    getColleagues(filters, employee_id),
  )
  return data
}
