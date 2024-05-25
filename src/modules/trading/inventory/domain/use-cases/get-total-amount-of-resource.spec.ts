import { InventoryInvalidArgumentError, InventoryNotFoundError } from '../model/inventory.erros'
import makeGetTotalAmountOfResource from './get-total-amount-of-resource'
import { MockInventoryDb, clearMockInventory, clearMockInventoryDb, mockInventoryDb } from './mocks/mocks'

describe('getTotalAmountOfResource', () => {
  let inventoryDb: MockInventoryDb
  let getTotalAmountOfResource: ReturnType<typeof makeGetTotalAmountOfResource>

  beforeEach(() => {
    clearMockInventoryDb()
    clearMockInventory()

    inventoryDb = mockInventoryDb
    getTotalAmountOfResource = makeGetTotalAmountOfResource({ inventoryDb })
  })

  it('returns the total amount of a resource in inventory', () => {
    const totalAmount = getTotalAmountOfResource({ resourceName: 'COAL' })
    expect(totalAmount).toBe(100)
  })

  it('throws an error, if the given resource is invalid', () => {
    expect(() => getTotalAmountOfResource({ resourceName: '' as ResourceType })).toThrow(InventoryInvalidArgumentError)
  })

  it('throws an error, if there exists no inventory for the given resource', () => {
    expect(() => getTotalAmountOfResource({ resourceName: 'GEM' })).toThrow(InventoryNotFoundError)
  })
})
