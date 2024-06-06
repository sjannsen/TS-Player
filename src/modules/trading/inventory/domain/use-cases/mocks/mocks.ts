import Id from '../../Id'

type MockInventory = {
  getRessource: jest.Mock
  getTotalAmount: jest.Mock
  getInventory: jest.Mock
  getInventoryForRobot: jest.Mock
  getTotalWorth: jest.Mock
  addToInventory: jest.Mock
  removeFromInventory: jest.Mock
}

const mockId = Id.makeId()

const mockInventory: MockInventory = {}

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
  findById: jest.Mock
  findAll: jest.Mock
  insert: jest.Mock
  update: jest.Mock
}

const mockInventoryDb: MockInventoryDb = {
  findById: jest.fn().mockImplementation(({ id }: { id: string }) => {
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

export { clearMockInventory, clearMockInventoryDb, mockInventory, mockInventoryDb }
