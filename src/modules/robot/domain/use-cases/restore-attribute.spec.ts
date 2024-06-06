import { RobotInvalidArgumentError } from '../models/robot.errors'
import { clearMockRobotDb, mockRobotDb } from './mocks/mock'
import makeRestoreAttribute from './restore-attribute'

describe('restoreAttribute', () => {
  const restoreAttribute = makeRestoreAttribute({ robotDb: mockRobotDb })

  beforeEach(() => {
    clearMockRobotDb()
  })

  it('restores the health and calls data access', async () => {
    const robot = await restoreAttribute({ robotServiceId: 'robotId', restorationType: 'HEALTH', availableHealth: 20 })

    expect(mockRobotDb.findById.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
    expect(robot.attributes.health).toBe(20)
  })

  it('restores the energy and calls data access', async () => {
    const robot = await restoreAttribute({ robotServiceId: 'robotId', restorationType: 'ENERGY', availableEnergy: 20 })

    expect(mockRobotDb.findById.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
    expect(robot.attributes.energy).toBe(20)
  })

  it('throws an error if no id is passed', async () => {
    await expect(restoreAttribute({ restorationType: 'ENERGY', availableEnergy: 5 })).rejects.toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error if restorationType is undefined', async () => {
    await expect(
      restoreAttribute({ robotServiceId: 'robotId', restorationType: '' as unknown as 'HEALTH', availableEnergy: 5 })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error if no attribute is passed', async () => {
    await expect(restoreAttribute({ robotServiceId: 'robotId', restorationType: 'ENERGY' })).rejects.toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error if restorationType HEALTH is missing availableHealth', async () => {
    await expect(
      restoreAttribute({ robotServiceId: 'robotId', restorationType: 'HEALTH', availableEnergy: 5 })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error if restorationType Energy is missing availableEnergy', async () => {
    await expect(
      restoreAttribute({ robotServiceId: 'robotId', restorationType: 'ENERGY', availableHealth: 5 })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error if availableHealth is negative', async () => {
    await expect(
      restoreAttribute({ robotServiceId: 'robotId', restorationType: 'HEALTH', availableHealth: -5 })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error if availableEnergy is negative', async () => {
    await expect(
      restoreAttribute({ robotServiceId: 'robotId', restorationType: 'ENERGY', availableEnergy: -5 })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })
})
