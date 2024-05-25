import { InventoryInvalidArgumentError, InventoryNotFoundError } from '../model/inventory.erros'
import { InventoryDb } from './types'

type GetTotalWorthForResourceDependencies = {
  inventoryDb: InventoryDb
}

type GetTotalWorthForResourceProps = {
  resourceName: ResourceType
}

export default function makeGetTotalWorthForResource({ inventoryDb }: GetTotalWorthForResourceDependencies) {
  return function getTotalWorthForResource({ resourceName }: GetTotalWorthForResourceProps) {
    if (!resourceName) throw new InventoryInvalidArgumentError(`ResourceName is invalid: ${resourceName}`)

    const inventory = inventoryDb.find(resourceName)
    if (!inventory) throw new InventoryNotFoundError(`Inventory for resource: ${resourceName} does not exist`)

    return inventory.getTotalWorth()
  }
}
