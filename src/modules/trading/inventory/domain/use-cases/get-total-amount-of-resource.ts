import { InventoryInvalidArgumentError, InventoryNotFoundError } from '../model/inventory.erros'
import { InventoryDb } from './types'

type GetTotalAmountForResourceDependencies = {
  inventoryDb: InventoryDb
}

type GetTotalAmountForResourceProps = {
  resourceName: ResourceType
}

export default function makeGetTotalAmountOfResource({ inventoryDb }: GetTotalAmountForResourceDependencies) {
  return function getTotalAmountOfResource({ resourceName }: GetTotalAmountForResourceProps) {
    if (!resourceName) throw new InventoryInvalidArgumentError(`ResourceName is invalid: ${resourceName}`)

    const inventory = inventoryDb.find(resourceName)
    if (!inventory) throw new InventoryNotFoundError(`Inventory for resource: ${resourceName} does not exist`)

    return inventory.getTotalAmount()
  }
}
