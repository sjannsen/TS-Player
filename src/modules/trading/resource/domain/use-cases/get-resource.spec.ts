import { ResourceNotFoundError } from '../model/resource.erros'
import makeGetRessource from './get-resource'
import { mockResource, mockResourceDb } from './mocks/mock'

describe('getRessource', () => {
  it('calls data access and returns the resource', () => {
    const getRessource = makeGetRessource({ ressourceDb: mockResourceDb })
    const ressource = getRessource({ name: 'COAL' })

    expect(ressource).toBe(mockResource)
    expect(mockResourceDb.find).toHaveBeenCalledTimes(1)
  })

  it('throws an error, if the resource does not exist', () => {
    const getRessource = makeGetRessource({ ressourceDb: mockResourceDb })
    expect(() => getRessource({ name: 'IRON' })).toThrow(ResourceNotFoundError)
  })
})
