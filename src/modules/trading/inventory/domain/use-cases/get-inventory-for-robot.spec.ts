import { InventoryInvalidArgumentError } from '../model/inventory.erros'
import makeGetInventoryForRobot from './get-inventory-for-robot'
import {
  MockInventoryDb,
  clearMockInventory,
  clearMockInventoryDb,
  mockInventoryDataEntry,
  mockInventoryDb,
} from './mocks/mocks'

describe('getInventoryForRobot', () => {
  let inventoryDb: MockInventoryDb
  let getInventoryForRobot: ReturnType<typeof makeGetInventoryForRobot>

  beforeEach(() => {
    clearMockInventoryDb()
    clearMockInventory()

    inventoryDb = mockInventoryDb
    getInventoryForRobot = makeGetInventoryForRobot({ inventoryDb })
  })

  it('returns the inventory for a given robotId', () => {
    const robotInventory = getInventoryForRobot({ robotId: 'robotId1' })
    expect(robotInventory).toEqual([mockInventoryDataEntry])
  })

  it('throws an error, if the given robotId is invalid', () => {
    expect(() => getInventoryForRobot({ robotId: '' })).toThrow(InventoryInvalidArgumentError)
  })
})
