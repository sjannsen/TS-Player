import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { clearMockRobotDb, mockRobotDb } from './mocks/mock'
import makeMoveRobot from './move-robot'

describe('moveRobot', () => {
  const moveRobot = makeMoveRobot({ robotDb: mockRobotDb })

  beforeEach(() => {
    clearMockRobotDb()
  })

  it('moves the robot and calls the data access', () => {
    const robot = moveRobot({ robotServiceId: 'robotId', planetToMove: 'newPlanet' })

    expect(mockRobotDb.find.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
    expect(robot.getCurrentPlanet()).toBe('newPlanet')
  })

  it('throws an error, if no id is passed', () => {
    expect(() => moveRobot({ planetToMove: 'newPlanet' })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the robot is not existing', () => {
    expect(() => moveRobot({ robotServiceId: 'invalidRobotId', planetToMove: 'newPlanet' })).toThrow(RobotNotFoundError)
  })

  it('throws an error, if no planet to move to is passed', () => {
    expect(() => moveRobot({ robotServiceId: 'invalidRobotId', planetToMove: '' })).toThrow(RobotInvalidArgumentError)
  })
})
