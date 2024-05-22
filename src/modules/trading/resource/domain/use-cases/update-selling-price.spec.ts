import { ResourceNotFoundError } from '../model/resource.erros'
import { mockGetResource, mockResource, mockResourceDb } from './mocks/mock'
import makeUpdateSellingPrice from './update-selling-price'

describe('updateSellingPrice', () => {
  it('calls updateSellingPrice on ressource and calls data access', () => {
    const updateSellingPrice = makeUpdateSellingPrice({ resourceDb: mockResourceDb, getRessource: mockGetResource })
    updateSellingPrice({ name: 'COAL', updatedPrice: 20 })

    expect(mockResource.updateSellingPrice.call.length).toBe(1)
    expect(mockResourceDb.update.call.length).toBe(1)
  })

  it('throws an error, if the ressource does not exist', () => {
    const updateSellingPrice = makeUpdateSellingPrice({ resourceDb: mockResourceDb, getRessource: mockGetResource })
    expect(() => updateSellingPrice({ name: 'IRON', updatedPrice: 10 })).toThrow(ResourceNotFoundError)
  })
})
