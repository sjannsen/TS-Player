import { RobotInvalidArgumentError } from '../models/robot.errors'
import { clearMockRobotDb, mockRobot, mockRobotDb } from './mocks/mock'
import makeRegenerateRobot from './regenerate-robot'

describe('regenerateRobot', () => {
  const regenerateRobot = makeRegenerateRobot({ robotDb: mockRobotDb })
  beforeEach(() => {
    clearMockRobotDb()
  })

  it('regenerates a robot and calls data access', async () => {
    const robot = await regenerateRobot({ robotServiceId: 'robotId', availableEnergy: 80 })
    expect(mockRobotDb.findById.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls[0][0]).toEqual({
      id: mockRobot.id,
      robotServiceId: 'robotId',
      attributes: { ...mockRobot.attributes, energy: 80 },
    })
    expect(robot.attributes.energy).toBe(80)
  })

  it('throws an error, if no id is provided', async () => {
    await expect(regenerateRobot({ robotServiceId: '', availableEnergy: 80 })).rejects.toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error, if level is availableEnergy', async () => {
    // @ts-expect-error Testing for invalid argument error when amountToAdd is undefined
    await expect(regenerateRobot({ robotServiceId: 'robotId', availableEnergy: undefined })).rejects.toThrow(
      RobotInvalidArgumentError
    )
  })
})
