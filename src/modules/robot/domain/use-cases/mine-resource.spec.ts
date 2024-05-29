import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import makeMineResource from './mine-resource'
import { clearMockRobotDb, mockRobot, mockRobotDb } from './mocks/mock'

describe('mineResource', () => {
  const mineResource = makeMineResource({ robotDb: mockRobotDb })

  beforeEach(() => {
    clearMockRobotDb()
  })

  it('updates the inventory and calls the data acces', () => {
    const robot = mineResource({ robotServiceId: 'robotId', minedResource: 'COAL', minedAmount: 5 })

    expect(mockRobotDb.find.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
    expect(robot.getInventory().getFreeCapacity()).toBe(0)
    expect(robot.getInventory().getStorage()['COAL']).toBe(mockRobot.getInventory().getStorage()['COAL'] + 5)
  })

  it('reduces the saved amount coresponding to the free capacity and calls the data access', () => {
    const robot = mineResource({ robotServiceId: 'robotId', minedResource: 'COAL', minedAmount: 4 })

    expect(mockRobotDb.find.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
    expect(robot.getInventory().getFreeCapacity()).toBe(1)
    expect(robot.getInventory().getStorage()['COAL']).toBe(mockRobot.getInventory().getStorage()['COAL'] + 4)
  })

  it('throws an error, if the mined resource is undefined', () => {
    expect(() =>
      mineResource({ robotServiceId: 'robotId', minedAmount: 5, minedResource: '' as ResourceType })
    ).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the mined amount is undefined', () => {
    expect(() =>
      mineResource({ robotServiceId: 'robotId', minedAmount: undefined as unknown as number, minedResource: 'COAL' })
    ).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the mined amount is negative', () => {
    expect(() => mineResource({ robotServiceId: 'robotId', minedAmount: -5, minedResource: 'COAL' })).toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error, if no id is passed', () => {
    expect(() => mineResource({ minedAmount: 5, minedResource: 'COAL' })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the robot is not existing', () => {
    expect(() => mineResource({ robotServiceId: 'invalidRobotId', minedAmount: 5, minedResource: 'COAL' })).toThrow(
      RobotNotFoundError
    )
  })
})
