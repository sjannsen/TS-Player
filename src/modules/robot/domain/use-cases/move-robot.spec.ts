import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { clearMockRobotDb, mockRobotDb } from './mocks/mock'
import makeMoveRobot from './move-robot'

describe('moveRobot', () => {
  const moveRobot = makeMoveRobot({ robotDb: mockRobotDb })

  beforeEach(() => {
    clearMockRobotDb()
  })

  it('moves the robot and calls the data access', async () => {
    const robot = await moveRobot({ robotServiceId: 'robotId', planetToMove: 'newPlanet', movementDifficulty: 1 })

    expect(mockRobotDb.findById.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
  })

  it('throws an error, if no id is passed', async () => {
    await expect(moveRobot({ planetToMove: 'newPlanet', movementDifficulty: 1 })).rejects.toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error, if the robot is not existing', async () => {
    await expect(
      moveRobot({ robotServiceId: 'invalidRobotId', planetToMove: 'newPlanet', movementDifficulty: 1 })
    ).rejects.toThrow(RobotNotFoundError)
  })

  it('throws an error, if no planet to move to is passed', async () => {
    await expect(
      moveRobot({ robotServiceId: 'invalidRobotId', planetToMove: '', movementDifficulty: 1 })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })
})
