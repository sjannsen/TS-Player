import { ResourceType } from '../../../../../shared/types'
import makeInventory from '../model'
import { InventoryData } from '../model/inventory'
import { InventoryInvalidArgumentError, InventoryNotFoundError } from '../model/inventory.erros'
import { InventoryDb } from './data-access'

type RemoveFromInventoryDependencies = {
  inventoryDb: InventoryDb
}

type RemoveFromInventoryProps = {
  inventoryId: string
  resource: ResourceType
  amount: number
}

export default function makeRemoveFromInventory({ inventoryDb }: RemoveFromInventoryDependencies) {
  return async function removeFromInventory({
    resource,
    inventoryId: id,
    amount,
  }: RemoveFromInventoryProps): Promise<InventoryData> {
    if (!id) throw new InventoryInvalidArgumentError(`InventoryId is invalid: ${id}`)
    if (!resource) throw new InventoryInvalidArgumentError(`ResourceName is invalid: ${resource}`)

    const existing = await inventoryDb.findById({ id })
    if (!existing) throw new InventoryNotFoundError(`Inventory with id: ${id} does not exist`)

    const inventory = makeInventory({ ...existing })
    inventory.removeFromStorage({ resource, amoutToRemove: amount })

    const updated = await inventoryDb.update({
      id: inventory.getId(),
      storage: inventory.getStorage(),
    })

    return { ...existing, ...updated }
  }
}
