import Id from '../../Id'
import { RobotData } from '../../models/robot'

export type MockRobotDb = {
  findById: jest.Mock
  findAll: jest.Mock
  insert: jest.Mock
  update: jest.Mock
}

const mockLevels = {
  healthLevel: 1,
  damageLevel: 1,
  miningSpeedLevel: 1,
  miningLevel: 1,
  energyLevel: 1,
  energyRegenLevel: 1,
  storageLevel: 1,
}

const mockAttributes = {
  maxHealth: 1,
  maxEnergy: 1,
  energyRegen: 1,
  attackDamage: 1,
  miningSpeed: 1,
  health: 1,
  energy: 1,
}

const robotId = Id.makeId()
const mockRobot = {
  id: robotId,
  robotServiceId: 'robotId',
  alive: true,
  player: 'player',
  attributes: mockAttributes,
  levels: mockLevels,
  currentPlanet: 'planet',
  inventoryId: 'inventoryId',
}

const findByIdMock = jest.fn().mockImplementation(({ id, robotServiceId }: { id: string; robotServiceId: string }) => {
  if (id === robotId || robotServiceId == 'robotId') return mockRobot
  return undefined
})
const updateMock = jest.fn().mockImplementation(async (robotData: RobotData) => {
  return Promise.resolve({ ...mockRobot, ...robotData })
})

const mockRobotDb: MockRobotDb = {
  findById: findByIdMock,
  findAll: jest.fn().mockResolvedValue([mockRobot, mockRobot]),
  insert: jest.fn().mockResolvedValue(mockRobot),
  update: updateMock,
}

const clearMockRobotDb = () => {
  mockRobotDb.findById.mockClear()
  mockRobotDb.update.mockClear()
  mockRobotDb.findAll.mockClear()
  mockRobotDb.insert.mockClear()
}

export { mockRobot, mockRobotDb, clearMockRobotDb }
