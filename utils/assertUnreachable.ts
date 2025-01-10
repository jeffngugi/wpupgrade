import assert from 'assert'

export function assertUnreachable(
  _onlyNever: never,
  errorMessage = 'Unreachable State',
): never {
  assert(false, errorMessage)
}
