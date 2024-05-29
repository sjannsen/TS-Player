import { RobotInvalidArgumentError } from '../models/robot.errors'
import makeGetRobot from './get-robot'
import { clearMockRobotDb, mockRobot, mockRobotDb } from './mocks/mock'

describe('getRobot', () => {
  const getRobot = makeGetRobot({ robotDb: mockRobotDb })

  beforeEach(() => {
    clearMockRobotDb()
  })

  it('returns a robot for a given id', () => {
    const robot = getRobot({ queryParams: { robotServiceId: 'robotId' } })
    expect(robot).toEqual(mockRobot)
  })

  it('returns undefined, if the robotId does not exist', () => {
    const robot = getRobot({ queryParams: { robotServiceId: 'invalidId' } })
    expect(robot).toBe(undefined)
  })

  it('throws an error, if no query params are provided', () => {
    expect(() => getRobot({ queryParams: {} })).toThrow(RobotInvalidArgumentError)
  })
})
