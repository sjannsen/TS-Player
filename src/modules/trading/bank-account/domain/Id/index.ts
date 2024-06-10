import { createId, isCuid } from '@paralleldrive/cuid2'

export type Id = {
  makeId: () => string
  isValidId: (id: string) => boolean
}

const Id: Id = {
  makeId: createId,
  isValidId: isCuid,
}

export default Id
