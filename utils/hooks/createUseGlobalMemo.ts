export function areShallowEqual(deps: unknown[], lastDeps: unknown[]) {
  return deps.every((dep, i) => lastDeps[i] === dep)
}

export function createUseGlobalMemo(areEqual = areShallowEqual) {
  let lastDeps: unknown[] = []
  let lastReturnValue: any = undefined

  return function useGlobalMemo<ReturnValue>(
    callback: () => ReturnValue,
    deps: unknown[],
  ): ReturnValue {
    if (lastReturnValue !== undefined && areEqual(deps, lastDeps)) {
      return lastReturnValue as ReturnValue
    }
    const returnValue = callback()
    lastReturnValue = returnValue as ReturnValue
    lastDeps = deps

    return returnValue
  }
}
