import {
  useState,
  useLayoutEffect,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { Map } from 'immutable'
import { camelizeKeys } from 'humps'

import { Meta, Resource } from '../../api'
import { ArrayElement } from '../typeUtils'
import { useAsyncOperation, Run } from './useAsyncOperation'
import { CachedState, useCachedState } from './useCachedState'

export function usePagination<Datum extends Resource<any>>(
  loadDataForPage: (params: {
    page: number
    per_page?: number
  }) => PromiseLike<{ data: Datum[]; meta: Meta }>,
  defaultPage = 1,
  perPage = 25,
  cancel?: () => void,
  isCancel?: (maybeError: unknown) => boolean,
): UsePaginationReturnType<Datum> {
  const [cache, setCache] = useState<Datum[]>([])
  const [page, setPage] = useState(defaultPage)
  const [isRefreshScheduled, setIsRefreshScheduled] = useState(false)
  const [meta, setMeta] = useState<Meta>({
    total_count: 0,
    total_pages: 0,
    page: defaultPage,
    per_page: perPage,
  })
  const pageDescriptor = useMemo(
    () => ({
      page,
      per_page: perPage,
    }),
    [page, perPage],
  )

  const [run, requestState] = useAsyncOperation(
    () => loadDataForPage(pageDescriptor),
    [loadDataForPage, pageDescriptor],
    cancel,
    isCancel,
  )
  const { dismiss, result } = requestState

  const reset = useCallback(() => {
    setCache([])
    setPage(defaultPage)
    setMeta({
      total_count: 0,
      total_pages: 0,
      per_page: perPage,
      page: defaultPage,
    })
  }, [defaultPage, perPage])

  const refresh = useCallback(() => {
    setIsRefreshScheduled(true)
    setPage(defaultPage)
    setMeta({
      total_count: 0,
      total_pages: 0,
      per_page: perPage,
      page: defaultPage,
    })
  }, [defaultPage, perPage])

  useEffect(() => {
    if (isRefreshScheduled) {
      setCache([])
      run()
      setIsRefreshScheduled(false)
    }
  }, [isRefreshScheduled, run, pageDescriptor])

  useLayoutEffect(
    function clearCacheOnChange() {
      reset()
    },
    [loadDataForPage, reset],
  )

  useLayoutEffect(
    function updateCacheOnResultChange() {
      if (!result) {
        return
      }

      const {
        data,
        meta: { page, per_page },
      } = result

      const offset = per_page * (page - 1)

      setCache(cache => {
        const clone = [...(cache || [])]
        data.forEach((datum: ArrayElement<typeof data>, index: number) => {
          clone[offset + index] = datum
        })

        return clone
      })
    },
    [result],
  )

  useLayoutEffect(() => {
    if (result && result.meta) {
      setMeta(result.meta)
    }
  }, [result])

  const stateToCache = useMemo(() => {
    if (requestState.state === 'success') {
      return { ...requestState, result: cache }
    }

    return requestState
  }, [requestState, cache])

  const cachedState = useCachedState(stateToCache)

  const { state } = cachedState
  const { total_pages } = meta

  const hasNext = page < total_pages
  const hasPrevious = page > 1

  const next = useCallback(() => {
    // This ensures local page cursor matches latest result
    // This is to handle cases where `next()` is called but
    // the network request fails and local `page` gets
    // out of sync with the last successful page.
    if (!hasNext || state !== 'success') {
      return
    }

    setPage(page => page + 1)
  }, [hasNext, state])

  const previous = useCallback(() => {
    if (!hasPrevious || state !== 'success') {
      return
    }

    setPage(page => page + 1)
  }, [hasPrevious, state])

  const bindNextButton = useCallback(() => {
    return {
      disabled: hasNext === false,
      onPress: next,
    }
  }, [hasNext, next])

  const bindPreviousButton = useCallback(() => {
    return {
      disabled: hasPrevious === false,
      onPress: previous,
    }
  }, [hasPrevious, previous])

  const bindPagination: BindPagination = useCallback(() => {
    // @TODO: get rid of Immutable maps
    const immutableMeta = Map<string, any>(camelizeKeys(meta))

    return {
      isLoading: state === 'pending' || state === 'stale',
      fetch: setPage,
      meta: immutableMeta,
    }
  }, [state, setPage, meta])

  const bindPaginatedResourceList =
    useCallback((): PaginatedResourceListProps<Datum> => {
      return {
        next,
        bindPagination,
        retry: run,
        refresh,
        state: cachedState,
      }
    }, [next, refresh, bindPagination, run, cachedState])

  return [
    run,
    cachedState,
    {
      dismiss,
      reset,
      next,
      previous,
      hasNext,
      hasPrevious,
      bindNextButton,
      bindPreviousButton,
      bindPagination,
      bindPaginatedResourceList,
    },
  ]
}

export type UsePaginationReturnType<
  Datum extends Resource<any>,
  Err extends Error = Error,
  Params extends any[] = any[],
  State = {
    data: Datum[]
    meta: Meta
  },
> = readonly [
  Run<State, Params>,
  CachedState<Datum[], Err>,
  {
    dismiss(): void
    reset(): void
    next(): void
    previous(): void
    hasNext: boolean
    hasPrevious: boolean
    bindNextButton(): void
    bindPreviousButton(): void
    bindPagination: BindPagination
    bindPaginatedResourceList(): PaginatedResourceListProps<Datum>
  },
]

export type BindPagination = () => PaginationProps

type PaginationProps = {
  meta: Map<string, any>
  fetch(page: number): void
  isLoading?: boolean
}

type PaginatedResourceListProps<Datum> = {
  next(): void
  bindPagination: BindPagination
  retry: Run<
    {
      data: Datum[]
      meta: Meta
    },
    []
  >
  refresh(): void
  state: CachedState<Datum[]>
}
