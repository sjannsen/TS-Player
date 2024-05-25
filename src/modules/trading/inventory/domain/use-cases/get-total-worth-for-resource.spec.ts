import { InventoryInvalidArgumentError, InventoryNotFoundError } from '../model/inventory.erros'
import makeGetTotalWorthForResource from './get-total-worth-for-resource'
import { MockInventoryDb, clearMockInventory, clearMockInventoryDb, mockInventoryDb } from './mocks/mocks'

describe('getTotalWorthForResource', () => {
  let inventoryDb: MockInventoryDb
  let getTotalWorthForResource: ReturnType<typeof makeGetTotalWorthForResource>

  beforeEach(() => {
    clearMockInventoryDb()
    clearMockInventory()

    inventoryDb = mockInventoryDb
    getTotalWorthForResource = makeGetTotalWorthForResource({ inventoryDb })
  })

  it('returns the total worth of a resource in inventory', () => {
    const totalWorth = getTotalWorthForResource({ resourceName: 'COAL' })
    expect(totalWorth).toBe(1000)
  })

  it('throws an error, if the given resource is invalid', () => {
    expect(() => getTotalWorthForResource({ resourceName: '' as ResourceType })).toThrow(InventoryInvalidArgumentError)
  })

  it('throws an error, if there exists no inventory for the given resource', () => {
    expect(() => getTotalWorthForResource({ resourceName: 'GEM' })).toThrow(InventoryNotFoundError)
  })
})
