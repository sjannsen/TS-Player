import { MakeRobotProps } from '../models/robot'
import makeCreateRobot from './create-robot'
import { clearMockRobotDb, mockRobot, mockRobotDb } from './mocks/mock'

describe('createRobot', () => {
  const createdRobot = makeCreateRobot({ robotDb: mockRobotDb })
  const robotProps: MakeRobotProps = {
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
    inventory: {
      maxStorage: 10,
      storageLevel: 5,
      storage: {
        COAL: 2,
        GEM: 2,
        GOLD: 1,
        IRON: 0,
        PLATIN: 0,
      },
    },
  }

  beforeEach(() => {
    clearMockRobotDb()
  })

  it('creates a robot, if not existing and calls data access', () => {
    createdRobot({ robot: robotProps })

    expect(mockRobotDb.find.mock.calls.length).toBe(1)
    expect(mockRobotDb.find.mock.calls[0][0]).toStrictEqual({ id: undefined, robotServiceId: 'newId' })
    expect(mockRobotDb.insert.mock.calls.length).toBe(1)
  })

  it('returns existing robot', () => {
    const robot = createdRobot({ robot: { ...robotProps, robotServiceId: 'robotId' } })

    expect(mockRobotDb.find.mock.calls.length).toBe(1)
    expect(mockRobotDb.find.mock.calls[0][0]).toStrictEqual({ id: undefined, robotServiceId: 'robotId' })
    expect(mockRobotDb.insert.mock.calls.length).toBe(0)
    expect(robot).toEqual(mockRobot)
  })
})
