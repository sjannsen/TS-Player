import { Resource } from '../../../resource/domain/model/resource'
import { ExceedsCurrentInventoryError, InvalidInventoryDataError, InventoryEntryNotFoundError } from './inventory.erros'

export type InventoryData = {
  [robotId: string]: Quantity
}

export type InventoryDataEntry = {
  robotId: string
  resource: Resource
  amount: Quantity
}

export type Inventory = {
  getRessource: () => Resource
  getTotalAmount: () => number
  getInventory: () => InventoryData
  getInventoryForRobot: ({ robotId }: { robotId: string }) => InventoryDataEntry
  getTotalWorth: () => number
  addToInventory: ({ robotId, amount }: { robotId: string; amount: Quantity }) => void
  removeFromInventory: ({ robotId, amount }: { robotId: string; amount: Quantity }) => void
}

type MakeRessourceProps = {
  resource: Resource
  initialInventory?: InventoryData
}

export default function buildMakeInventory() {
  return function makeInventory({ resource, initialInventory = {} }: MakeRessourceProps): Inventory {
    for (const [key, value] of Object.entries(initialInventory)) {
      if (!key || !value)
        throw new InvalidInventoryDataError(`Key: [${key}] or value: [${value}] of initial inventory is undefined`)
    }
    const inventory = initialInventory

    const addToInventory = ({ robotId, amount }: { robotId: string; amount: Quantity }) => {
      const currentAmount = inventory[robotId]

      if (!currentAmount) throw new InventoryEntryNotFoundError('Inventory not found for robotId: ' + robotId)

      inventory[robotId] = currentAmount.add(amount.getAmount())
    }

    const removeFromInventory = ({ robotId, amount }: { robotId: string; amount: Quantity }) => {
      const currentAmount = inventory[robotId]
      if (!currentAmount) throw new InventoryEntryNotFoundError('Inventory not found for robotId: ' + robotId)
      if (currentAmount.getAmount() < amount.getAmount()) throw new ExceedsCurrentInventoryError()
      inventory[robotId] = currentAmount.reduce(amount.getAmount())
    }

    const getTotalAmount = () => {
      let amount = 0
      for (const [key, value] of Object.entries(inventory)) {
        if (!value) throw new InvalidInventoryDataError(`Inventory data for ${key} is undefined`)
        amount += value.getAmount()
      }
      return amount
    }

    const getTotalWorth = () => {
      const totalAmount = getTotalAmount()
      return totalAmount * resource.getSellingPrice()
    }

    const getInventoryForRobot = ({ robotId }: { robotId: string }) => {
      const amount = inventory[robotId]
      if (!amount) throw new InventoryEntryNotFoundError(`Inventory entry for robotId: ${robotId} not found`)
      const inventoryDataEntry: InventoryDataEntry = {
        robotId,
        resource: resource,
        amount,
      }
      return inventoryDataEntry
    }

    return Object.freeze({
      getRessource: () => resource,
      getTotalAmount,
      getInventory: () => inventory,
      getInventoryForRobot,
      addToInventory,
      removeFromInventory,
      getTotalWorth,
    })
  }
}
