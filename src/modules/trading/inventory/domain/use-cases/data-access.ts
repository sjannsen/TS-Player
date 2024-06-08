import { InventoryData } from '../model/inventory'

export type InventoryDb = {
  insert: (inventoryData: InventoryData) => Promise<InventoryData>
  update: (inventoryData: Partial<InventoryData>) => Promise<Partial<InventoryData> | null>
  findById: ({ id }: { id: string }) => Promise<InventoryData | null>
  findAll: () => Promise<InventoryData[]>
}
