import makeRobot from '../models'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { extractRobotProps } from '../utils'
import { RobotDb } from './types'

type RemoveResourceDependencies = {
  robotDb: RobotDb
}

type RemoveResourceProps = {
  id?: string
  robotServiceId?: string
  resource: ResourceType
  amount: number
}

export default function makeRemoveResource({ robotDb }: RemoveResourceDependencies) {
  return function removeResource({ id, robotServiceId, resource, amount }: RemoveResourceProps) {
    if (!id && !robotServiceId) throw new RobotInvalidArgumentError(`An id is needed: ${id}, ${robotServiceId}`)
    if (!resource) throw new RobotInvalidArgumentError(`The resource to remove must be provided: ${resource}`)
    if (!amount) throw new RobotInvalidArgumentError(`The amount remove must be provided: ${amount}`)
    if (amount < 0) throw new RobotInvalidArgumentError(`The amount remove must not be negative: ${amount}`)

    const existingRobot = robotDb.find({ id, robotServiceId })
    if (!existingRobot) throw new RobotNotFoundError(`Robot with id: ${robotServiceId} not found`)

    const existingRobotInventory = existingRobot.getInventory()

    if (amount > existingRobotInventory.getStorage()[resource])
      throw new RobotInvalidArgumentError(
        `Amount to remove must not exceed the current storage: ${amount}, current storage: ${existingRobotInventory.getStorage()[resource]}`
      )

    let amountToRemove = amount
    if (amountToRemove > existingRobotInventory.getUsedStorage())
      amountToRemove = existingRobotInventory.getUsedStorage()

    const storage: Partial<InventoryResources> = {
      [resource]: existingRobotInventory.getStorage()[resource] - amountToRemove,
    }

    const existingProps = extractRobotProps({ robot: existingRobot })
    const robot = makeRobot({
      ...existingProps,
      inventory: {
        maxStorage: existingProps.inventory.maxStorage,
        storageLevel: existingProps.inventory.storageLevel,
        storage: { ...existingProps.inventory.storage, ...storage },
      },
    })

    robotDb.update(robot)
    return robot
  }
}
