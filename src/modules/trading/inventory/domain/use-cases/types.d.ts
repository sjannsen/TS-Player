import { Inventory } from '../model/inventory'

type InventoryDb = {
  insert: (inventory: Inventory) => Inventory
  update: (inventory: Inventory) => Inventory
  find: (name: string) => Inventory | undefined
  findAll: () => Array<Inventory>
}
