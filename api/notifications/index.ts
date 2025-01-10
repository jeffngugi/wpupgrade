import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'

type FetchNotificationsQueryProps = {
  queryKey: any
  pageParam?: number
}

const fetchNotifications = async ({
  queryKey,
  pageParam = 1,
}: FetchNotificationsQueryProps) => {
  const { filters } = queryKey[1]
  if (pageParam) filters.page = pageParam
  const { data } = await axios.get('mobile-notifications', { params: filters })
  return data
}

export const useFetchNotificationsInfinite = (filters: any) =>
  useInfiniteQuery({
    queryKey: ['notifications', { filters }],
    queryFn: fetchNotifications,
    getNextPageParam: (lastPage, pages) => {
      const lastPageData = lastPage?.data?.data
      return lastPageData?.next_page_url ? lastPageData?.current_page + 1 : null
    },
  })
