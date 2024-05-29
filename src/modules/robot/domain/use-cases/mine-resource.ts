import { mineRessources } from '../../output/commands'
import makeRobot from '../models'
import { RobotInvalidArgumentError, RobotInvalidInventory, RobotNotFoundError } from '../models/robot.errors'
import { extractRobotProps } from '../utils'
import { RobotDb } from './types'

type MineResourceDepencencies = {
  robotDb: RobotDb
}

type MineResourceProps = {
  id?: string
  robotServiceId?: string
  minedAmount: number
  minedResource: ResourceType
}

export default function makeMineResource({ robotDb }: MineResourceDepencencies) {
  return function mineResource({ id, robotServiceId, minedAmount, minedResource }: MineResourceProps) {
    if (!minedResource) throw new RobotInvalidArgumentError(`Mined resource must not be undefined: ${mineRessources}`)
    if (!minedAmount) throw new RobotInvalidArgumentError(`Mined amount must not be undefined: ${minedAmount}`)
    if (minedAmount < 0) throw new RobotInvalidArgumentError(`Mined amount must not be negative: ${minedAmount}`)
    if (!id && !robotServiceId) throw new RobotInvalidArgumentError(`An id is needed: ${id}, ${robotServiceId}`)

    const existingRobot = robotDb.find({ id, robotServiceId })
    if (!existingRobot) throw new RobotNotFoundError(`Robot with id: ${robotServiceId} not found`)

    const existingRobotInventory = existingRobot.getInventory()
    if (existingRobotInventory.isFull()) throw new RobotInvalidInventory('...')

    let actualMinedAmount = minedAmount
    if (actualMinedAmount > existingRobotInventory.getFreeCapacity())
      actualMinedAmount = existingRobotInventory.getMaxStorage() - existingRobotInventory.getUsedStorage()

    const storage: Partial<InventoryResources> = {
      [minedResource]: existingRobotInventory.getStorage()[minedResource] + actualMinedAmount,
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
