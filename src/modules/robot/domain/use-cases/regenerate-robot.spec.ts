import { RobotInvalidArgumentError } from '../models/robot.errors'
import { clearMockRobotDb, mockRobotDb } from './mocks/mock'
import makeRegenerateRobot from './regenerate-robot'

describe('regenerateRobot', () => {
  const regenerateRobot = makeRegenerateRobot({ robotDb: mockRobotDb })
  beforeEach(() => {
    clearMockRobotDb()
  })

  it('regenerates a robot and calls data access', () => {
    const robot = regenerateRobot({ robotServiceId: 'robotId', availableEnergy: 80 })
    expect(mockRobotDb.find.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
    expect(robot.getAttributes().energy).toBe(80)
  })

  it('throws an error, if no id is provided', () => {
    expect(() => regenerateRobot({ robotServiceId: '', availableEnergy: 80 })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if level is availableEnergy', () => {
    expect(() =>
      regenerateRobot({ robotServiceId: 'robotId', availableEnergy: undefined as unknown as number })
    ).toThrow(RobotInvalidArgumentError)
  })
})
