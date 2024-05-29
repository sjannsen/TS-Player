import { RobotInvalidArgumentError } from '../models/robot.errors'
import { clearMockRobotDb, mockRobotDb } from './mocks/mock'
import makeRestoreAttribute from './restore-attribute'

describe('restoreAttribute', () => {
  const restoreAttribute = makeRestoreAttribute({ robotDb: mockRobotDb })

  beforeEach(() => {
    clearMockRobotDb()
  })

  it('restores the health and calls data access', () => {
    const robot = restoreAttribute({ robotServiceId: 'robotId', restorationType: 'HEALTH', availableHealth: 20 })

    expect(mockRobotDb.find.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
    expect(robot.getAttributes().health).toBe(20)
  })

  it('restores the energy and calls data access', () => {
    const robot = restoreAttribute({ robotServiceId: 'robotId', restorationType: 'ENERGY', availableEnergy: 20 })

    expect(mockRobotDb.find.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
    expect(robot.getAttributes().energy).toBe(20)
  })

  it('throws an error if no id is passed', () => {
    expect(() => restoreAttribute({ restorationType: 'ENERGY', availableEnergy: 5 })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error if restorationType is undefined', () => {
    expect(() =>
      restoreAttribute({ robotServiceId: 'robotId', restorationType: '' as unknown as 'HEALTH', availableEnergy: 5 })
    ).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error if no attribute is passed', () => {
    expect(() => restoreAttribute({ robotServiceId: 'robotId', restorationType: 'ENERGY' })).toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error if restorationType HEALTH is missing availableHealth', () => {
    expect(() =>
      restoreAttribute({ robotServiceId: 'robotId', restorationType: 'HEALTH', availableEnergy: 5 })
    ).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error if restorationType Energy is missing availableEnergy', () => {
    expect(() =>
      restoreAttribute({ robotServiceId: 'robotId', restorationType: 'ENERGY', availableHealth: 5 })
    ).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error if availableHealth is negative', () => {
    expect(() =>
      restoreAttribute({ robotServiceId: 'robotId', restorationType: 'HEALTH', availableHealth: -5 })
    ).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error if availableEnergy is negative', () => {
    expect(() =>
      restoreAttribute({ robotServiceId: 'robotId', restorationType: 'ENERGY', availableEnergy: -5 })
    ).toThrow(RobotInvalidArgumentError)
  })
})
