import { InventoryInvalidArgumentError, InventoryNotFoundError } from '../model/inventory.erros'
import { InventoryDb } from './types'

type GetInventoryForRessourceDependencies = {
  inventoryDb: InventoryDb
}

type GetInventoryForRessourceProps = {
  resourceName: ResourceType
}

export default function makeGetInventoryForRessource({ inventoryDb }: GetInventoryForRessourceDependencies) {
  return function getInventoryForRessource({ resourceName }: GetInventoryForRessourceProps) {
    if (!resourceName) throw new InventoryInvalidArgumentError(`ResourceName is invalid: ${resourceName}`)

    const inventory = inventoryDb.find(resourceName)
    if (!inventory) throw new InventoryNotFoundError(`Inventory for resource: ${resourceName} does not exist`)

    return inventory
  }
}
