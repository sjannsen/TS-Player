import { ResourceType } from '../../../../event-handling/robot/robot.types'
import { InventoryData } from '../../../trading/inventory/domain/model/inventory'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { RobotDb } from './data-access'

type RemoveFromInventory = ({
  inventoryId,
  resource,
  amount,
}: {
  inventoryId: string
  resource: ResourceType
  amount: number
}) => Promise<InventoryData | null>

type RemoveResourceDependencies = {
  robotDb: RobotDb
  removeFromInventory: RemoveFromInventory
}

type RemoveResourceProps = {
  id?: string
  robotServiceId?: string
  resource: ResourceType
  amount: number
}

export default function makeRemoveResource({ robotDb, removeFromInventory }: RemoveResourceDependencies) {
  return async function removeResource({
    id,
    robotServiceId,
    resource,
    amount,
  }: RemoveResourceProps): Promise<{ removedAmount: number }> {
    const IDS_UNDEFINED_ERROR = `Id: ${id} and robotServiceId: ${robotServiceId} are undefined`
    const RESOURCE_UNDEFINED_ERROR = `The resource to remove is undefined: ${resource}`
    const AMOUNT_UNDEFINED_ERROR = `The amountToRemove is undefined: ${amount}`
    const AMOUNT_NEGATIVE_ERROR = `The amountToRemove is negative: ${amount}`

    if (!id && !robotServiceId) throw new RobotInvalidArgumentError(IDS_UNDEFINED_ERROR)
    if (!resource) throw new RobotInvalidArgumentError(RESOURCE_UNDEFINED_ERROR)
    if (!amount) throw new RobotInvalidArgumentError(AMOUNT_UNDEFINED_ERROR)
    if (amount < 0) throw new RobotInvalidArgumentError(AMOUNT_NEGATIVE_ERROR)

    const existing = await robotDb.findById({ id, robotServiceId })
    if (!existing) throw new RobotNotFoundError(`Robot with id: ${robotServiceId} not found`)

    const inventoryId = existing.inventoryId
    if (!inventoryId) throw new Error(`Inventory for Robot: ${id} does not exist`)
    await removeFromInventory({ inventoryId, resource, amount })

    return { removedAmount: amount }
  }
}
