import { InventoryData } from '../model/inventory'
import { InventoryDb } from './data-access'

type GetInventoryForRobotDependencies = {
  inventoryDb: InventoryDb
}

type GetInventoryForRobotProps = {
  robotId: string
}

export default function makeGetInventoryForRobot({ inventoryDb }: GetInventoryForRobotDependencies) {
  return async function getInventoryForRobot({ robotId }: GetInventoryForRobotProps): Promise<InventoryData | null> {
    const inventoryData = await inventoryDb.findByRobotId({ id: robotId })
    if (!inventoryData) return null
    return { ...inventoryData }
  }
}
