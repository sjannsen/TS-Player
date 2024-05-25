import { InventoryDataEntry } from '../model/inventory'
import { InventoryInvalidArgumentError } from '../model/inventory.erros'
import { InventoryDb } from './types'

type GetInventoryForRobotDependencies = {
  inventoryDb: InventoryDb
}

type GetInventoryForRobotProps = {
  robotId: string
}

export default function makeGetInventoryForRobot({ inventoryDb }: GetInventoryForRobotDependencies) {
  return function getInventoryForRobot({ robotId }: GetInventoryForRobotProps) {
    if (!robotId) throw new InventoryInvalidArgumentError(`RobotId is invalid: ${robotId}`)

    const inventories = inventoryDb.findAll()
    const robotInventory: InventoryDataEntry[] = []

    inventories.forEach((inventory) => {
      const inventoryDataEntry = inventory.getInventoryForRobot({ robotId })
      robotInventory.push(inventoryDataEntry)
    })

    return robotInventory
  }
}
