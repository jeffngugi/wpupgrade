import { InstantString } from './dateTime'
import { UUID } from './identifiers'

export type Resource<Type extends string, Attributes, Includables = {}> = {
  id: UUID
  type: Type
  attributes: Attributes & {
    created_at: InstantString
    updated_at: InstantString
  }
  relationships?: {
    [K in keyof Includables]?: Includables[K] | null
  }
  links?: {
    self: string
  }
}
