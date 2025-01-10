export const deserialize = <V>(value: string | null | undefined) => {
  if (value === null || value === undefined) {
    return undefined
  }

  try {
    return JSON.parse(value) as V
  } catch (e) {
    return undefined
  }
}

export const serialize = <V>(value: V): string => {
  return JSON.stringify(value)
}
