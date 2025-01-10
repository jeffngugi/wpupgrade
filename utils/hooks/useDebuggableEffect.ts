import isEqual from 'fast-deep-equal/es6'
import { EffectCallback, useEffect, useRef } from 'react'
import { stripIndent } from 'common-tags'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'

type Config = {
  debugName?: string
  disabled?: boolean
  maxToleratedWastefulRendersCount?: number
}

export function useDebuggableEffect(
  callback: EffectCallback,
  deps: unknown[],
  {
    debugName = '<no debug name provider>',
    maxToleratedWastefulRendersCount = 5,
    disabled = false,
  }: Config,
) {
  const depsHistory = useRef<Array<unknown[] | undefined>>([])
  const wastefulRenders = useRef(0)

  useEffect(() => {
    const prevDeps = depsHistory.current[0]
    depsHistory.current.unshift(deps)

    if (prevDeps?.every((prevDep, i) => prevDep === deps[i])) {
      wastefulRenders.current = 0
      depsHistory.current = [deps]
      return
    }

    const compareDepHistory = (i: number) => {
      const depHistory = depsHistory.current.map(entry => entry?.[i])

      const deduplicated = uniq(depHistory)
      const deduplicatedByValue = uniqBy(depHistory, isEqual)

      if (deduplicated.length <= maxToleratedWastefulRendersCount) {
        return 'no-issues'
      }

      if (typeof depHistory[0] === 'function') {
        return 'function'
      }

      if (deduplicatedByValue.length === 1) {
        return 'identical-object'
      }

      if (deduplicated.length > deduplicatedByValue.length) {
        return 'object'
      }

      return 'no-issues'
    }

    if (!disabled && prevDeps && process.env.NODE_ENV === 'development') {
      if (
        prevDeps.every(
          (prevDep, i) =>
            typeof prevDep === 'function' || isEqual(prevDep, deps[i]),
        )
      ) {
        wastefulRenders.current += 1

        if (wastefulRenders.current > maxToleratedWastefulRendersCount) {
          for (let i = 0; i < depsHistory.current.length; i++) {
            const result = compareDepHistory(i)

            if (result === 'function') {
              console.error(stripIndent`
                The effect "${debugName}" has a function as a dependency, which is fine, but it looks
                like this function is changing too many times, which probably indicates it is not being
                memoized correctly.

                For example:

                const c = () => { console.log('foo') } // <-- new function created on every render

                useEffect(() => {

                }, [c]) // <-- effect re-runs on every render because c changes every time


                Make sure you are memoizing the function at index ${i} correctly using 'useCallback'.
              `)
            } else if (result === 'identical-object') {
              console.error(stripIndent`
                The effect "${debugName}" has a object as a dependency, which is fine, but it looks
                like this object is changing too many times, which probably indicates it is not being
                memoized correctly.

                This means you are likely passing an object as a dependency but this object is changing identity
                on every render.

                For example:

                const c = { foo: 'bar' } // <-- new object created on every render

                useEffect(() => {

                }, [c]) // <-- effect re-runs on every render because c changes every time

                Please make sure you are memoizing the object at index ${i} correctly.

                Alternatively, you can use 'useMemoizedObject' hook to memoize a plain object.
            `)
            }
          }

          throw stripIndent`
            The effect "${debugName}" has re-run more than ${maxToleratedWastefulRendersCount} times
            with the dependencies changing every time even though they are equal by value.

            This is probably due to unmemoized objects or functions used as dependencies for the effect.

            Throwing to stop rendering because this is usually going to cause an infinite loop in production.
          `
        }

        console.error(
          stripIndent`
            Re-running effect "${debugName}" because deps have changed by reference even though they are all equal by value,

            This means you are likely passing an object as a dependency but this object is changing identity
            on every render.

            For example:

            const c = { foo: 'bar' } // <-- new object created on every render

            useEffect(() => {

            }, [c]) // <-- effect re-runs on every render because c changes every time

            Please make sure that you are memoizing all the dependencies, using e.g. 'useMemo'

            Alternatively, you can use 'useMemoizedObject' hook to memoize a plain object.

            If you are using a function as a dependency, make sure you are memoizing the
            function correctly using 'useCallback'.
          `,
        )
      }

      const { detailedDiff } = require('deep-object-diff')
      const diffDetails = detailedDiff(prevDeps, deps)
      console.debug(
        `Running effect ${debugName} because deps have changed`,
        diffDetails,
      )
    }

    return callback()
  })
}
