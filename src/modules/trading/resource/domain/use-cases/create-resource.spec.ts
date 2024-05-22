import makeCreateResource from './create-resource'
import { mockResourceDb } from './mocks/mock'

describe('createResource', () => {
  beforeEach(() => {
    mockResourceDb.insert.mockClear()
  })

  it('creates a resource and calls data access layer', () => {
    const createRessource = makeCreateResource({ resourceDb: mockResourceDb })
    createRessource({ name: 'COAL', initialPrice: 10 })
    expect(mockResourceDb.insert.call.length).toBe(1)
  })
})
