import makeInventory from '../model'
import { InventoryDb } from './data-access'

type GetInventoryCapacityDependencies = {
  inventoryDb: InventoryDb
}

type GetInventoryCapacityProps = {
  inventoryId: string
}

export default function makeGetInventoryCapacity({ inventoryDb }: GetInventoryCapacityDependencies) {
  return async function getInventoryCapacity({ inventoryId: id }: GetInventoryCapacityProps) {
    const inventoryData = await inventoryDb.findById({ id })
    if (!inventoryData) throw new Error(`Inventory with id: ${id} not found`)

    const inventory = makeInventory({ ...inventoryData })

    return { freeCapacity: inventory.getFreeCapacity() }
  }
}
