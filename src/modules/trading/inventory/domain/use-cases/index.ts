import inventoryDb from '../../adapters/output/data-access'
import makeAddToInventory from './add-to-inventory'
import makeCreateInventory from './create-inventory'
import makeGetInventory from './get-inventory'
import makeGetInventoryCapacity from './get-inventory-capacity'
import makeRemoveFromInventory from './remove-from-inventory'

const addToInventory = makeAddToInventory({ inventoryDb })
const createInventory = makeCreateInventory({ inventoryDb })
const getInventory = makeGetInventory({ inventoryDb })
const getInventoryCapacity = makeGetInventoryCapacity({ inventoryDb })
const removeFromInventory = makeRemoveFromInventory({ inventoryDb })

const inventoryService = Object.freeze({
  addToInventory,
  createInventory,
  getInventory,
  getInventoryCapacity,
  removeFromInventory,
})

export default inventoryService
export { addToInventory, createInventory, getInventory, getInventoryCapacity, removeFromInventory }
