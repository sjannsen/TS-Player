import inventorieDb from '../../adapters/output/data-access'
import makeAddToInventory from './add-to-inventory'
import makeCreateInventory from './create-inventory'
import makeGetInventory from './get-inventory'
import makeGetInventoryCapacity from './get-inventory-capacity'
import makeRemoveFromInventory from './remove-from-inventory'

const addToInventory = makeAddToInventory({ inventoryDb: inventorieDb })
const createInventory = makeCreateInventory({ inventoryDb: inventorieDb })
const getInventory = makeGetInventory({ inventoryDb: inventorieDb })
const getInventoryCapacity = makeGetInventoryCapacity({ inventoryDb: inventorieDb })
const removeFromInventory = makeRemoveFromInventory({ inventoryDb: inventorieDb })

const inventoryService = Object.freeze({
  addToInventory,
  createInventory,
  getInventory,
  getInventoryCapacity,
  removeFromInventory,
})

export default inventoryService
export { addToInventory, createInventory, getInventory, getInventoryCapacity, removeFromInventory }
