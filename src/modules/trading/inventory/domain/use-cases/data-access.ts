import { InventoryData } from '../model/inventory'

export type InventoryDb = {
  insert: ({ inventoryData }: { inventoryData: InventoryData }) => Promise<InventoryData>
  update: ({ inventoryData }: { inventoryData: Partial<InventoryData> }) => Promise<InventoryData | null>
  findById: ({ id }: { id: string }) => Promise<InventoryData | null>
  findByRobotId: ({ id }: { id: string }) => Promise<InventoryData | null>
  findAll: () => Promise<InventoryData[]>
}
