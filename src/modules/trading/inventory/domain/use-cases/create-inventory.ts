import makeInventory from '../model'
import { InventoryData } from '../model/inventory'
import { InventoryDb } from './data-access'

type CreateInventoryDependencies = {
  inventoryDb: InventoryDb
}

export default function makeCreateInventory({ inventoryDb }: CreateInventoryDependencies) {
  return async function createInventory({ inventoryData }: { inventoryData: InventoryData }) {
    const inventory = makeInventory({ ...inventoryData })
    const exists = await inventoryDb.findById({ id: inventory.getId() })

    if (exists) return exists

    return await inventoryDb.insert(inventoryData)
  }
}
