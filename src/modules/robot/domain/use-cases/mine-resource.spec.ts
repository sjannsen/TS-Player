import { ResourceType } from '../../../../event-handling/robot/robot.types'
import { PlanetResource } from '../../../map/domain/model/planet'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import makeMineResource from './mine-resource'
import { clearMockRobotDb, mockRobotDb } from './mocks/mock'

describe('mineResource', () => {
  const getPlanetResourceMock = jest
    .fn()
    .mockReturnValue({ resourceType: 'COAL', currentAmount: 10, maxAmount: 10 } as PlanetResource)
  const getFreeInventoryCapacityMock = jest.fn().mockReturnValue({ freeCapacity: 5 })
  const addToInventoryMock = jest.fn()
  const minePlanetResouceMock = jest.fn()

  const mineResource = makeMineResource({
    robotDb: mockRobotDb,
    getPlanetResource: getPlanetResourceMock,
    getFreeInventoryCapacity: getFreeInventoryCapacityMock,
    addToInventory: addToInventoryMock,
    minePlanetResource: minePlanetResouceMock,
  })

  beforeEach(() => {
    clearMockRobotDb()
  })

  it('updates the inventory and calls the data access', async () => {
    const robotData = await mineResource({ robotServiceId: 'robotId', minedResource: 'COAL', minedAmount: 5 })

    expect(mockRobotDb.findById.mock.calls.length).toBe(1)
    expect(robotData.minedAmount).toBe(5)
    expect(robotData.freeCapacityLeft).toBe(0)
  })

  it('reduces the saved amount coresponding to the free capacity and calls the data access', async () => {
    const robotData = await mineResource({ robotServiceId: 'robotId', minedResource: 'COAL', minedAmount: 10 })

    expect(mockRobotDb.findById.mock.calls.length).toBe(1)
    expect(robotData.minedAmount).toBe(5)
    expect(robotData.freeCapacityLeft).toBe(0)
  })

  it('throws an error when the mined resource is undefined', async () => {
    await expect(
      mineResource({ robotServiceId: 'robotId', minedAmount: 5, minedResource: '' as ResourceType })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error when the mined amount is undefined', async () => {
    await expect(
      mineResource({ robotServiceId: 'robotId', minedAmount: undefined as unknown as number, minedResource: 'COAL' })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error when the mined amount is negative', async () => {
    await expect(mineResource({ robotServiceId: 'robotId', minedAmount: -5, minedResource: 'COAL' })).rejects.toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error when no id is passed', async () => {
    await expect(mineResource({ minedAmount: 5, minedResource: 'COAL' })).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error when the robot is not existing', async () => {
    await expect(
      mineResource({ robotServiceId: 'invalidRobotId', minedAmount: 5, minedResource: 'COAL' })
    ).rejects.toThrow(RobotNotFoundError)
  })

  it('throws an error when the resource to mine does not exist on the planet', async () => {
    await expect(
      mineResource({ robotServiceId: 'invalidRobotId', minedAmount: 5, minedResource: 'GEM' })
    ).rejects.toThrow(RobotNotFoundError)
  })
})
