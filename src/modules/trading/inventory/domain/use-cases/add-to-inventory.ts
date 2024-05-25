import { InventoryInvalidArgumentError, InventoryNotFoundError } from '../model/inventory.erros'
import { InventoryDb } from './types'

type AddToInventoryDependencies = {
  inventoryDb: InventoryDb
}

type AddToInventoryProps = {
  resourceName: ResourceType
  robotId: string
  amount: Quantity
}

export default function makeAddToInventory({ inventoryDb }: AddToInventoryDependencies) {
  return function addToInventory({ resourceName, robotId, amount }: AddToInventoryProps) {
    if (!resourceName) throw new InventoryInvalidArgumentError(`ResourceName is invalid: ${resourceName}`)
    if (!robotId) throw new InventoryInvalidArgumentError(`RobotId is invalid: ${robotId}`)
    const inventory = inventoryDb.find(resourceName)

    if (!inventory) throw new InventoryNotFoundError(`Inventory for resource: ${resourceName} does not exist`)
    inventory.addToInventory({ robotId, amount })
    inventoryDb.update(inventory)
  }
}
