import { InventoryDb } from './data-access'

type GetInventoryDependencies = {
  inventoryDb: InventoryDb
}

export default function makeGetInventory({ inventoryDb }: GetInventoryDependencies) {
  return async function getInventory({ id }: { id: string }) {
    if (!id) throw new Error(`Cannot get inventory. Id: ${id} is undefined`)
    return await inventoryDb.findById({ id })
  }
}
