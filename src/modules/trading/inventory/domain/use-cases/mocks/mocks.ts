import { Resource } from '../../../../resource/domain/model/resource'
import { InventoryData, InventoryDataEntry } from '../../model/inventory'

const mockResource: Resource = {
  getName: jest.fn().mockReturnValue('COAL'),
  getSellingPrice: jest.fn().mockReturnValue(100),
  updateSellingPrice: jest.fn(),
}

const mockQuantity: Quantity = {
  getAmount: jest.fn().mockReturnValue(10),
  add: jest.fn().mockReturnValue({
    getAmount: jest.fn().mockReturnValue(20),
    add: jest.fn(),
    reduce: jest.fn(),
    toString: jest.fn().mockReturnValue('20'),
  }),
  reduce: jest.fn().mockReturnValue({
    getAmount: jest.fn().mockReturnValue(0),
    add: jest.fn(),
    reduce: jest.fn(),
    toString: jest.fn().mockReturnValue('0'),
  }),
  toString: jest.fn().mockReturnValue('10'),
}

const mockInventoryData: InventoryData = {
  robot1: mockQuantity,
  robot2: mockQuantity,
}

const mockInventoryDataEntry: InventoryDataEntry = {
  robotId: 'robot1',
  resource: mockResource,
  amount: mockQuantity,
}

type MockInventory = {
  getRessource: jest.Mock
  getTotalAmount: jest.Mock
  getInventory: jest.Mock
  getInventoryForRobot: jest.Mock
  getTotalWorth: jest.Mock
  addToInventory: jest.Mock
  removeFromInventory: jest.Mock
}

const mockInventory: MockInventory = {
  getRessource: jest.fn().mockReturnValue(mockResource),
  getTotalAmount: jest.fn().mockReturnValue(100),
  getInventory: jest.fn().mockReturnValue(mockInventoryData),
  getInventoryForRobot: jest.fn().mockReturnValue(mockInventoryDataEntry),
  getTotalWorth: jest.fn().mockReturnValue(1000),
  addToInventory: jest.fn(),
  removeFromInventory: jest.fn(),
}

const clearMockInventory = () => {
  mockInventory.getRessource.mockClear()
  mockInventory.getTotalAmount.mockClear()
  mockInventory.getInventory.mockClear()
  mockInventory.getInventoryForRobot.mockClear()
  mockInventory.getTotalWorth.mockClear()
  mockInventory.addToInventory.mockClear()
  mockInventory.removeFromInventory.mockClear()
}

export type MockInventoryDb = {
  find: jest.Mock
  findAll: jest.Mock
  insert: jest.Mock
  update: jest.Mock
}

const mockInventoryDb: MockInventoryDb = {
  find: jest.fn().mockImplementation((resource: string) => {
    return resource == 'COAL' ? mockInventory : undefined
  }),
  update: jest.fn().mockReturnValue(mockInventory),
  findAll: jest.fn().mockReturnValue([mockInventory]),
  insert: jest.fn().mockReturnValue(mockInventory),
}

const clearMockInventoryDb = () => {
  mockInventoryDb.find.mockClear()
  mockInventoryDb.update.mockClear()
  mockInventoryDb.findAll.mockClear()
  mockInventoryDb.insert.mockClear()
}

export {
  clearMockInventory,
  clearMockInventoryDb,
  mockInventory,
  mockInventoryData,
  mockInventoryDataEntry,
  mockInventoryDb,
  mockQuantity,
}
