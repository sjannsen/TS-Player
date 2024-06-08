import { ResourceType } from '../../../../../event-handling/map/map.types'
import makeInventory from '../model'
import { InventoryData } from '../model/inventory'
import { InventoryInvalidArgumentError, InventoryNotFoundError } from '../model/inventory.erros'
import { InventoryDb } from './data-access'

type AddToInventoryDependencies = {
  inventoryDb: InventoryDb
}

type AddToInventoryProps = {
  inventoryId: string
  resource: ResourceType
  amount: number
}

export default function makeAddToInventory({ inventoryDb }: AddToInventoryDependencies) {
  return async function addToInventory({
    inventoryId: id,
    resource,
    amount,
  }: AddToInventoryProps): Promise<InventoryData> {
    if (!id) throw new InventoryInvalidArgumentError(`RobotId is invalid: ${id}`)
    if (!resource) throw new InventoryInvalidArgumentError(`ResourceName is invalid: ${resource}`)

    const existing = await inventoryDb.findById({ id })
    if (!existing) throw new InventoryNotFoundError(`Inventory: ${id} does not exist`)

    const inventory = makeInventory({ ...existing })
    inventory.addToStorage({ resource, amountToAdd: amount })

    const updated = await inventoryDb.update({
      id: inventory.getId(),
      storage: inventory.getStorage(),
    })

    return { ...existing, ...updated }
  }
}
