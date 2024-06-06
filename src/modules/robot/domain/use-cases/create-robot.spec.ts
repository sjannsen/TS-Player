import { RobotData } from '../models/robot'
import makeCreateRobot from './create-robot'
import { clearMockRobotDb, mockRobot, mockRobotDb } from './mocks/mock'

describe('createRobot', () => {
  const createdRobot = makeCreateRobot({ robotDb: mockRobotDb })
  const robotData: RobotData = {
    robotServiceId: 'newId',
    alive: true,
    attributes: {
      maxHealth: 1,
      maxEnergy: 1,
      energyRegen: 1,
      attackDamage: 1,
      miningSpeed: 1,
      health: 1,
      energy: 1,
    },
    levels: {
      healthLevel: 1,
      damageLevel: 1,
      miningSpeedLevel: 1,
      miningLevel: 1,
      energyLevel: 1,
      energyRegenLevel: 1,
      storageLevel: 1,
    },
    currentPlanet: 'planetId',
    player: 'player',
  }

  beforeEach(() => {
    clearMockRobotDb()
  })

  it('creates a robot, if not existing and calls data access', async () => {
    await createdRobot({ robotData: robotData })

    expect(mockRobotDb.findById.mock.calls.length).toBe(1)
    expect(mockRobotDb.findById.mock.calls[0][0]).toStrictEqual({ id: undefined, robotServiceId: 'newId' })
    expect(mockRobotDb.insert.mock.calls.length).toBe(1)
  })

  it('returns existing robot', async () => {
    const robot = await createdRobot({ robotData: { ...robotData, robotServiceId: 'robotId' } })

    expect(mockRobotDb.findById.mock.calls.length).toBe(1)
    expect(mockRobotDb.findById.mock.calls[0][0]).toStrictEqual({ id: undefined, robotServiceId: 'robotId' })
    expect(mockRobotDb.insert.mock.calls.length).toBe(0)
    expect(robot).toEqual(mockRobot)
  })
})
