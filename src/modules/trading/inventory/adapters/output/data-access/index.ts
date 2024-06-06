import { InventoryData } from '../../../domain/model/inventory'
import { InventoryDb } from '../../../domain/use-cases/data-access'

/* eslint-disable @typescript-eslint/no-unused-vars */
const inventoryDb: InventoryDb = {
  insert: ({ inventoryData }: { inventoryData: InventoryData }) =>
    new Promise((resolve) => resolve({} as InventoryData)),
  update: ({ inventoryData }: { inventoryData: Partial<InventoryData> }) =>
    new Promise((resolve) => resolve({} as InventoryData)),
  findById: ({ id }: { id: string }) => new Promise((resolve) => resolve({} as InventoryData)),
  findAll: () => new Promise((resolve) => resolve([])),
}

export default inventoryDb
