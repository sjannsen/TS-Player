import { InventoryInvalidArgumentError, InventoryNotFoundError } from '../model/inventory.erros'
import { InventoryDb } from './types'

type RemoveFromInventoryDependencies = {
  inventoryDb: InventoryDb
}

type RemoveFromInventoryProps = {
  resourceName: ResourceType
  robotId: string
  amount: Quantity
}

export default function makeRemoveFromInventory({ inventoryDb }: RemoveFromInventoryDependencies) {
  return function removeFromInventory({ resourceName, robotId, amount }: RemoveFromInventoryProps) {
    if (!resourceName) throw new InventoryInvalidArgumentError(`ResourceName is invalid: ${resourceName}`)
    if (!robotId) throw new InventoryInvalidArgumentError(`RobotId is invalid: ${robotId}`)

    const inventory = inventoryDb.find(resourceName)
    if (!inventory) throw new InventoryNotFoundError(`Inventory for resource: ${resourceName} does not exist`)

    inventory.removeFromInventory({ robotId, amount })
    inventoryDb.update(inventory)
  }
}
