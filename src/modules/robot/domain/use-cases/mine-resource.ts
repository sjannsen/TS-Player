import { ResourceType } from '../../../../event-handling/robot/robot.types'
import logger from '../../../../utils/logger'
import { PlanetResource } from '../../../map/domain/model/planet'
import makeRobot from '../models'
import { RobotError, RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { RobotDb } from './data-access'

type GetPlanetResouce = ({ planetId }: { planetId: string }) => Promise<PlanetResource | undefined>
type GetFreeInventoryCapacity = ({ inventoryId }: { inventoryId: string }) => Promise<{ freeCapacity: number }>
type AddToInventory = ({
  inventoryId,
  resource,
}: {
  inventoryId: string
  resource: ResourceType
  amount: number
}) => Promise<unknown>
type MinePlanetResource = ({ mapServiceId, amount }: { mapServiceId: string; amount: number }) => Promise<unknown>

type MineResourceDepencencies = {
  robotDb: RobotDb
  getPlanetResource: GetPlanetResouce
  getFreeInventoryCapacity: GetFreeInventoryCapacity
  addToInventory: AddToInventory
  minePlanetResource: MinePlanetResource
}

type MineResourceProps = {
  id?: string
  robotServiceId?: string
  minedAmount: number
  minedResource: ResourceType
}

export default function makeMineResource({
  robotDb,
  getPlanetResource,
  getFreeInventoryCapacity,
  addToInventory,
  minePlanetResource,
}: MineResourceDepencencies) {
  return async function mineResource({
    id,
    robotServiceId,
    minedAmount,
    minedResource,
  }: MineResourceProps): Promise<{ minedAmount: number; freeCapacityLeft: number }> {
    if (!minedResource) throw new RobotInvalidArgumentError(`Mined resource must not be undefined: ${minedResource}`)
    if (!minedAmount) throw new RobotInvalidArgumentError(`Mined amount must not be undefined: ${minedAmount}`)
    if (minedAmount < 0) throw new RobotInvalidArgumentError(`Mined amount must not be negative: ${minedAmount}`)
    if (!id && !robotServiceId) throw new RobotInvalidArgumentError(`An id is needed: ${id}, ${robotServiceId}`)

    const existing = await robotDb.findById({ id, robotServiceId })
    if (!existing) throw new RobotNotFoundError(`Robot with id: ${robotServiceId} not found`)

    const robot = makeRobot(existing)
    const inventoryId = robot.getInventoryId()
    if (!inventoryId) throw new RobotError(`Inventory for robot: ${robot.getId()} is undefined`)

    const planetResource = await getPlanetResource({ planetId: robot.getId() })
    if (!planetResource)
      throw new RobotError(
        `Robot: ${robot.getId()} Cannot mine resource on planet: ${robot.getCurrentPlanet()} because planet has no resources`
      )

    const { type, currentAmount } = planetResource
    if (currentAmount == 0)
      throw new RobotError(
        `Robot: ${robot.getId()} Cannot mine resource on planet: ${robot.getCurrentPlanet()} because current amount is 0`
      )
    if (type !== minedResource)
      throw new RobotError(
        `Robot: ${robot.getId()} Cannot mine resource on planet: ${robot.getCurrentPlanet()} of type: ${minedResource} because type on planet is: ${type}`
      )

    const { freeCapacity } = await getFreeInventoryCapacity({ inventoryId })
    let actualMinedAmount = minedAmount
    if (actualMinedAmount > freeCapacity) {
      actualMinedAmount = freeCapacity
      logger.warn(
        { robotServiceId, minedResource, minedAmount, freeCapacity },
        'Mined amount exceeds inventory capacity. Only saving reduced amount'
      )
    }
    const freeCapacityLeft = freeCapacity - actualMinedAmount

    await addToInventory({ inventoryId, resource: minedResource, amount: minedAmount })
    await minePlanetResource({ mapServiceId: robot.getCurrentPlanet(), amount: minedAmount })

    return { minedAmount: actualMinedAmount, freeCapacityLeft }
  }
}
