import { InventoryInvalidArgumentError, InventoryNotFoundError } from '../model/inventory.erros'
import makeAddToInventory from './add-to-inventory'
import {
  MockInventoryDb,
  clearMockInventory,
  clearMockInventoryDb,
  mockInventory,
  mockInventoryDb,
  mockQuantity,
} from './mocks/mocks'

describe('addToInventory', () => {
  let inventoryDb: MockInventoryDb
  let addToInventory: ReturnType<typeof makeAddToInventory>

  beforeEach(() => {
    clearMockInventoryDb()
    clearMockInventory()

    inventoryDb = mockInventoryDb
    addToInventory = makeAddToInventory({ inventoryDb })
  })

  it('adds an amount to the inventory and calls the data access layer', () => {
    addToInventory({ resourceName: 'COAL', amount: mockQuantity, robotId: 'robotId1' })

    expect(inventoryDb.find.mock.calls.length).toBe(1)
    expect(inventoryDb.update.mock.calls.length).toBe(1)
    expect(mockInventory.addToInventory.mock.calls.length).toBe(1)
  })

  it('throws an error, if the resourceName is invalid', () => {
    expect(() =>
      addToInventory({ resourceName: '' as ResourceType, amount: mockQuantity, robotId: 'robotId1' })
    ).toThrow(InventoryInvalidArgumentError)
  })

  it('throws an error, if the robotId is invalid', () => {
    expect(() => addToInventory({ resourceName: 'COAL', amount: mockQuantity, robotId: '' })).toThrow(
      InventoryInvalidArgumentError
    )
  })

  it('throws an error, if there not exist an inventory for the given resource', () => {
    expect(() => addToInventory({ resourceName: 'GEM', amount: mockQuantity, robotId: 'robotId1' })).toThrow(
      InventoryNotFoundError
    )
  })
})
