import makeAddToInventory from './add-to-inventory'
import inventoryDb from '../../output/data-access'
import makeGetInventoryForRessource from './get-inventory-for-resource'
import makeGetTotalAmountOfResource from './get-total-amount-of-resource'
import makeGetTotalWorthForResource from './get-total-worth-for-resource'
import makeRemoveFromInventory from './remove-from-inventory'
import makeGetTotalWorth from './get-total-worth'

const addToInventory = makeAddToInventory({ inventoryDb })
const getInventoryForRessource = makeGetInventoryForRessource({ inventoryDb })
const getInventoryForRobot = makeGetInventoryForRessource({ inventoryDb })
const getTotalAmountOfResource = makeGetTotalAmountOfResource({ inventoryDb })
const getTotalWorth = makeGetTotalWorth({ inventoryDb })
const getTotalWorthForResource = makeGetTotalWorthForResource({ inventoryDb })
const removeFromInventory = makeRemoveFromInventory({ inventoryDb })

const inventoryService = Object.freeze({
  addToInventory,
  getInventoryForRessource,
  getInventoryForRobot,
  getTotalAmountOfResource,
  getTotalWorth,
  getTotalWorthForResource,
  removeFromInventory,
})

export default inventoryService
export {
  addToInventory,
  getInventoryForRessource,
  getInventoryForRobot,
  getTotalAmountOfResource,
  getTotalWorth,
  getTotalWorthForResource,
  removeFromInventory,
}
