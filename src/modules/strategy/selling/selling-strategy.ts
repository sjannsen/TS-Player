import { SellTradablesCommandData } from '../../../shared/commands'
import logger from '../../../utils/logger'
import { RobotData } from '../../robot/domain/models/robot'

type GetSellingStrategyDependencies = {
  inventoryService: {
    getInventoryCapacity({ inventoryId }: { inventoryId: string }): Promise<{
      freeCapacity: number
    }>
  }
  sellResources: ({ robotId, planetId }: SellTradablesCommandData) => Promise<void>
}

export default function makeGetSellingStrategy({ inventoryService, sellResources }: GetSellingStrategyDependencies) {
  return async function getSellingStrategy({ robot }: { robot: RobotData }): Promise<boolean> {
    const inventoryId = robot.inventoryId
    if (!inventoryId) throw new Error(`InventoryId of robot: ${JSON.stringify(robot)} is undefined`)

    const { freeCapacity } = await inventoryService.getInventoryCapacity({ inventoryId })
    if (freeCapacity > 0) return false

    logger.info({ robot }, 'Sell resources')
    sellResources({ robotId: robot.robotServiceId, planetId: robot.currentPlanet })
    return true
  }
}
