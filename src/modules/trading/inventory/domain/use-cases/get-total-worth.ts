import { InventoryDb } from './types'

type GetTotalWorthDependencies = {
  inventoryDb: InventoryDb
}

export default function makeGetTotalWorth({ inventoryDb }: GetTotalWorthDependencies) {
  return function getTotalWorth() {
    const inventories = inventoryDb.findAll()

    let totalWorth = 0
    inventories.forEach((inventory) => (totalWorth += inventory.getTotalWorth()))

    return totalWorth
  }
}
