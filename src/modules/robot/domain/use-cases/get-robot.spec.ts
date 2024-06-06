import { RobotInvalidArgumentError } from '../models/robot.errors'
import makeGetRobot from './get-robot'
import { clearMockRobotDb, mockRobot, mockRobotDb } from './mocks/mock'

describe('getRobot', () => {
  const getRobot = makeGetRobot({ robotDb: mockRobotDb })

  beforeEach(() => {
    clearMockRobotDb()
  })

  it('returns a robot for a given id', async () => {
    const robot = await getRobot({ queryParams: { robotServiceId: 'robotId' } })
    expect(mockRobotDb.findById.mock.calls.length).toBe(1)
    expect(robot).toEqual(mockRobot)
  })

  it('returns undefined, if the robotId does not exist', async () => {
    const robot = await getRobot({ queryParams: { robotServiceId: 'invalidId' } })
    expect(mockRobotDb.findById.mock.calls.length).toBe(1)
    expect(robot).toBe(undefined)
  })

  it('throws an error, if no query params are provided', async () => {
    await expect(getRobot({ queryParams: {} })).rejects.toThrow(RobotInvalidArgumentError)
  })
})
