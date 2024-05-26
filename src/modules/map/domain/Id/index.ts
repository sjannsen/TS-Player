import { createId, isCuid } from '@paralleldrive/cuid2'

type Id = {
  makeId: () => string
  isValidId: (id: string) => boolean
}

const Id: Id = Object.freeze({
  makeId: createId,
  isValidId: isCuid,
})

export default Id
