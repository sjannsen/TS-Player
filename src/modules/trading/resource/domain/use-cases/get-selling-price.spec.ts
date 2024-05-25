import { ResourceNotFoundError } from '../model/resource.erros'
import makeGetSellingPrice from './get-selling-price'
import { mockGetResource, mockResource } from './mocks/mock'

describe('getSellingPrice', () => {
  it('returns the selling price', () => {
    const getSellingPrice = makeGetSellingPrice({ getRessource: mockGetResource })
    const sellingPrice = getSellingPrice({ name: 'COAL' })
    expect(sellingPrice).toEqual(mockResource.getSellingPrice())
  })

  it('throws an error, if the resource does not exist', () => {
    const getSellingPrice = makeGetSellingPrice({ getRessource: mockGetResource })
    expect(() => getSellingPrice({ name: 'IRON' })).toThrow(ResourceNotFoundError)
  })
})
