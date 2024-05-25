import { InventoryInvalidArgumentError, InventoryNotFoundError } from '../model/inventory.erros'
import makeGetInventoryForRessource from './get-inventory-for-resource'
import {
  MockInventoryDb,
  clearMockInventory,
  clearMockInventoryDb,
  mockInventory,
  mockInventoryDb,
} from './mocks/mocks'

describe('getInventoryForRessource', () => {
  let inventoryDb: MockInventoryDb
  let getInventoryForRessource: ReturnType<typeof makeGetInventoryForRessource>

  beforeEach(() => {
    clearMockInventoryDb()
    clearMockInventory()

    inventoryDb = mockInventoryDb
    getInventoryForRessource = makeGetInventoryForRessource({ inventoryDb })
  })

  it('returns the inventory for a given resource', () => {
    const inventory = getInventoryForRessource({ resourceName: 'COAL' })

    expect(inventoryDb.find.mock.calls.length).toBe(1)
    expect(inventory).toBe(mockInventory)
  })

  it('throws an error, if the given resource is invalid', () => {
    expect(() => {
      getInventoryForRessource({ resourceName: '' as ResourceType })
    }).toThrow(InventoryInvalidArgumentError)
  })

  it('throws an error, if no inventory exists for the given resource', () => {
    expect(() => getInventoryForRessource({ resourceName: 'GEM' })).toThrow(InventoryNotFoundError)
  })
})
