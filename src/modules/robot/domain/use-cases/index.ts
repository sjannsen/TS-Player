import planetService from '../../../map/domain/use-cases'
import inventoryService from '../../../trading/inventory/domain/use-cases'
import robotDb from '../../adapters/output/data-access'
import makeAttackRobot from './attack-robot'
import makeCreateRobot from './create-robot'
import makeGetRobot from './get-robot'
import makeListRobots from './list-robots'
import makeMineResource from './mine-resource'
import makeMoveRobot from './move-robot'
import makeRegenerateRobot from './regenerate-robot'
import makeRemoveResource from './remove-resource'
import makeRestoreAttribute from './restore-attribute'
import makeUpgradeRobot from './upgrade-robot'

const attackRobot = makeAttackRobot({ robotDb: robotDb })
const createRobot = makeCreateRobot({ robotDb: robotDb })
const getRobot = makeGetRobot({ robotDb: robotDb })
const listRobots = makeListRobots({ robotDb: robotDb })
const mineResource = makeMineResource({
  robotDb: robotDb,
  getFreeInventoryCapacity: inventoryService.getInventoryCapacity,
  addToInventory: inventoryService.addToInventory,
  getPlanetResource: planetService.getPlanetResource,
  minePlanetResource: planetService.mineResource,
})
const moveRobot = makeMoveRobot({ robotDb: robotDb })
const regenerateRobot = makeRegenerateRobot({ robotDb: robotDb })
const removeResource = makeRemoveResource({
  robotDb: robotDb,
  removeFromInventory: inventoryService.removeFromInventory,
})
const restoreAttributes = makeRestoreAttribute({ robotDb: robotDb })
const upgradeRobot = makeUpgradeRobot({ robotDb: robotDb })

const robotService = Object.freeze({
  attackRobot,
  createRobot,
  getRobot,
  listRobots,
  mineResource,
  moveRobot,
  regenerateRobot,
  removeResource,
  restoreAttributes,
  upgradeRobot,
})

export default robotService
export {
  attackRobot,
  createRobot,
  getRobot,
  listRobots,
  mineResource,
  moveRobot,
  regenerateRobot,
  removeResource,
  restoreAttributes,
  upgradeRobot,
}
