import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { clearMockRobotDb, mockRobot, mockRobotDb } from './mocks/mock'
import makeRemoveResource from './remove-resource'

describe('removeResource', () => {
  const removeResource = makeRemoveResource({ robotDb: mockRobotDb })

  beforeEach(() => {
    clearMockRobotDb()
  })

  it('removes an amount from the storage and calls the data acces', () => {
    const robot = removeResource({ robotServiceId: 'robotId', resource: 'COAL', amount: 1 })

    expect(mockRobotDb.find.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
    expect(robot.getInventory().getFreeCapacity()).toBe(6)
    expect(robot.getInventory().getStorage()['COAL']).toBe(mockRobot.getInventory().getStorage()['COAL'] - 1)
  })

  it('clears the storage if the amount to remove is equal to the current storage and calls the data access', () => {
    const robot = removeResource({ robotServiceId: 'robotId', resource: 'COAL', amount: 2 })

    expect(mockRobotDb.find.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
    expect(robot.getInventory().getFreeCapacity()).toBe(7)
    expect(robot.getInventory().getStorage()['COAL']).toBe(mockRobot.getInventory().getStorage()['COAL'] - 2)
  })

  it('throws an error, if the amount to remove exceeds the current storage', () => {
    expect(() => removeResource({ robotServiceId: 'robotId', amount: 5, resource: 'COAL' })).toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error, if the resource to remove is undefined', () => {
    expect(() => removeResource({ robotServiceId: 'robotId', amount: 1, resource: '' as ResourceType })).toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error, if the amount to remove is undefined', () => {
    expect(() =>
      removeResource({ robotServiceId: 'robotId', amount: undefined as unknown as number, resource: 'COAL' })
    ).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the amount to remove is negative', () => {
    expect(() => removeResource({ robotServiceId: 'robotId', amount: -5, resource: 'COAL' })).toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error, if no id is passed', () => {
    expect(() => removeResource({ amount: 1, resource: 'COAL' })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the robot is not existing', () => {
    expect(() => removeResource({ robotServiceId: 'invalidRobotId', amount: 1, resource: 'COAL' })).toThrow(
      RobotNotFoundError
    )
  })
})
