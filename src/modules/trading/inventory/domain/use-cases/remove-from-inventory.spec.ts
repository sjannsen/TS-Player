import { InventoryInvalidArgumentError, InventoryNotFoundError } from '../model/inventory.erros'
import {
  MockInventoryDb,
  clearMockInventory,
  clearMockInventoryDb,
  mockInventory,
  mockInventoryDb,
  mockQuantity,
} from './mocks/mocks'
import makeRemoveFromInventory from './remove-from-inventory'

describe('removeFromInventory', () => {
  let inventoryDb: MockInventoryDb
  let removeFromInventory: ReturnType<typeof makeRemoveFromInventory>

  beforeEach(() => {
    clearMockInventoryDb()
    clearMockInventory()

    inventoryDb = mockInventoryDb
    removeFromInventory = makeRemoveFromInventory({ inventoryDb })
  })

  it('removes an amount from the inventory and calls the data access layer', () => {
    removeFromInventory({ resourceName: 'COAL', robotId: 'robotId1', amount: mockQuantity })

    expect(inventoryDb.find.mock.calls.length).toBe(1)
    expect(inventoryDb.update.mock.calls.length).toBe(1)
    expect(mockInventory.removeFromInventory.mock.calls.length).toBe(1)
  })

  it('throws an error, if the resourceName is invalid', () => {
    expect(() =>
      removeFromInventory({ resourceName: '' as ResourceType, robotId: 'robotId1', amount: mockQuantity })
    ).toThrow(InventoryInvalidArgumentError)
  })

  it('throws an error, if the robotId is invalid', () => {
    expect(() => removeFromInventory({ resourceName: 'COAL', robotId: '', amount: mockQuantity })).toThrow(
      InventoryInvalidArgumentError
    )
  })

  it('throws an error, if there not exist an inventory for the given resource', () => {
    expect(() => removeFromInventory({ resourceName: 'GEM', amount: mockQuantity, robotId: 'robotId1' })).toThrow(
      InventoryNotFoundError
    )
  })
})
