import { Inventory } from '../../domain/model/inventory'
import { InventoryDb } from '../../domain/use-cases/types'

/* eslint-disable @typescript-eslint/no-unused-vars */
const inventoryDb: InventoryDb = {
  find: (name: string) => ({}) as Inventory,
  findAll: () => [] as Array<Inventory>,
  insert: (inventory: Inventory) => ({}) as Inventory,
  update: (inventory: Inventory) => ({}) as Inventory,
}

export default inventoryDb
