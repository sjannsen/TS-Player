import Id from '../../Id'

export type MockRobotDb = {
  find: jest.Mock
  findAll: jest.Mock
  insert: jest.Mock
  update: jest.Mock
}

const mockLevels = jest.fn().mockReturnValue({
  healthLevel: 1,
  damageLevel: 1,
  miningSpeedLevel: 1,
  miningLevel: 1,
  energyLevel: 1,
  energyRegenLevel: 1,
  storageLevel: 1,
})

const mockAttributes = jest.fn().mockReturnValue({
  maxHealth: 1,
  maxEnergy: 1,
  energyRegen: 1,
  attackDamage: 1,
  miningSpeed: 1,
  health: 1,
  energy: 1,
})

const mockInventory = {
  getStorageLevel: jest.fn().mockReturnValue(1),
  getUsedStorage: jest.fn().mockReturnValue(5),
  getMaxStorage: jest.fn().mockReturnValue(10),
  isFull: jest.fn().mockReturnValue(false),
  getFreeCapacity: jest.fn().mockReturnValue(5),
  getStorage: jest.fn().mockReturnValue({
    COAL: 2,
    IRON: 1,
    GEM: 1,
    GOLD: 1,
    PLATIN: 0,
  }),
}

const robotId = Id.makeId()
const mockRobot = {
  getId: jest.fn().mockReturnValue(robotId),
  getRobotServiceId: jest.fn().mockReturnValue('robotId'),
  isAlive: jest.fn().mockReturnValue(true),
  getPlayer: jest.fn().mockReturnValue('player'),
  getAttributes: jest.fn().mockReturnValue(mockAttributes),
  getLevels: jest.fn().mockReturnValue(mockLevels),
  getInventory: jest.fn().mockReturnValue(mockInventory),
  getCurrentPlanet: jest.fn().mockReturnValue('planet'),
}

const mockRobotDb: MockRobotDb = {
  find: jest.fn().mockImplementation(({ id, robotServiceId }: { id: string; robotServiceId: string }) => {
    if (id === robotId || robotServiceId == 'robotId') return mockRobot
    return undefined
  }),
  findAll: jest.fn().mockReturnValue([mockRobot, mockRobot]),
  insert: jest.fn().mockReturnValue(mockRobot),
  update: jest.fn().mockReturnValue(mockRobot),
}

const clearMockRobotDb = () => {
  mockRobotDb.find.mockClear()
  mockRobotDb.update.mockClear()
  mockRobotDb.findAll.mockClear()
  mockRobotDb.insert.mockClear()
}

export { mockRobot, mockRobotDb, clearMockRobotDb }
