import { ResourceType } from '../../../../shared/types'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { clearMockRobotDb, mockRobotDb } from './mocks/mock'
import makeRemoveResource from './remove-resource'

describe('removeResource', () => {
  const removeFromInventoryMock = jest
    .fn()
    .mockImplementation(
      async ({
        robotServiceId,
        resource,
        amount,
        inventoryId,
      }: {
        robotServiceId: string
        amount: number
        resource: ResourceType
        inventoryId: string
      }) => {
        if (robotServiceId == 'invalidRobotId' || amount < 0 || amount > 2 || resource != 'COAL')
          throw new RobotInvalidArgumentError()
        if (inventoryId != 'inventoryId') throw new Error()
      }
    )
  const removeResource = makeRemoveResource({ robotDb: mockRobotDb, removeFromInventory: removeFromInventoryMock })

  beforeEach(() => {
    clearMockRobotDb()
    removeFromInventoryMock.mockClear()
  })

  it('removes an amount from the storage and calls the data acces', async () => {
    const { removedAmount } = await removeResource({ robotServiceId: 'robotId', resource: 'COAL', amount: 1 })

    expect(mockRobotDb.findById.mock.calls.length).toBe(1)
    expect(removeFromInventoryMock.mock.calls.length).toBe(1)
    expect(removeFromInventoryMock.mock.calls[0][0]).toEqual({
      resource: 'COAL',
      amount: 1,
      inventoryId: 'inventoryId',
    })
    expect(removedAmount).toBe(1)
  })

  it('throws an error, if the amount to remove exceeds the current storage', async () => {
    await expect(removeResource({ robotServiceId: 'robotId', amount: 5, resource: 'COAL' })).rejects.toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error, if the resource to remove is undefined', async () => {
    await expect(
      removeResource({ robotServiceId: 'robotId', amount: 1, resource: '' as ResourceType })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the amount to remove is undefined', async () => {
    await expect(
      removeResource({ robotServiceId: 'robotId', amount: undefined as unknown as number, resource: 'COAL' })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the amount to remove is negative', async () => {
    await expect(removeResource({ robotServiceId: 'robotId', amount: -5, resource: 'COAL' })).rejects.toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error, if no id is passed', async () => {
    await expect(removeResource({ amount: 1, resource: 'COAL' })).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the robot is not existing', async () => {
    await expect(removeResource({ robotServiceId: 'invalidRobotId', amount: 1, resource: 'COAL' })).rejects.toThrow(
      RobotNotFoundError
    )
  })
})
