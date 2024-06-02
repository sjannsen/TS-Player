import { Id } from '../Id'
import { RobotInvalidArgumentError } from './robot.errors'
import { InventoryResources, RobotAttributes, RobotLevels } from './types'

export type RobotInventory = {
  getStorageLevel: () => number
  getUsedStorage: () => number
  getMaxStorage: () => number
  getFreeCapacity: () => number
  isFull: () => boolean
  getStorage: () => InventoryResources
}

export type Robot = {
  getId: () => string
  getRobotServiceId: () => string
  isAlive: () => boolean
  getPlayer: () => string
  getAttributes: () => RobotAttributes
  getLevels: () => RobotLevels
  getInventory: () => RobotInventory
  getCurrentPlanet: () => string
}

type MakeRobotDependencies = {
  Id: Id
}

export type MakeRobotProps = {
  id?: string
  robotServiceId: string
  alive: boolean
  player: string
  attributes: RobotAttributes
  levels: RobotLevels
  inventory: {
    storageLevel: number
    maxStorage: number
    storage: InventoryResources
  }
  currentPlanet: string
}

export default function buildMakeRobot({ Id }: MakeRobotDependencies) {
  return function makeRobot({
    id = Id.makeId(),
    robotServiceId,
    player,
    alive,
    attributes,
    levels,
    inventory,
    currentPlanet,
  }: MakeRobotProps): Robot {
    if (!Id.isValidId(id)) throw new RobotInvalidArgumentError(`Id is invalid: ${id}`)
    if (!robotServiceId) throw new RobotInvalidArgumentError(`robotServiceId is invalid: ${id}`)
    if (!player) throw new RobotInvalidArgumentError(`Player is required`)
    if (!attributes) throw new RobotInvalidArgumentError(`Attributes is required`)
    if (!levels) throw new RobotInvalidArgumentError(`Levels is required`)
    if (!inventory) throw new RobotInvalidArgumentError(`Inventory is required`)
    if (!currentPlanet) throw new RobotInvalidArgumentError(`Current planet is required`)

    for (const [key, value] of Object.entries(attributes)) {
      if (value === undefined || value === null)
        throw new RobotInvalidArgumentError(`Attribute ${key} is invalid: ${value}`)
      if (value < 0) throw new RobotInvalidArgumentError(`Attribute ${key} must not be negative: ${value}`)
    }

    for (const [key, value] of Object.entries(levels)) {
      if (value === undefined || value === null)
        throw new RobotInvalidArgumentError(`Level ${key} is invalid: ${value}`)
      if (value < 0) throw new RobotInvalidArgumentError(`Level ${key} must not be negative: ${value}`)
    }

    for (const [key, value] of Object.entries(inventory.storage)) {
      if (value === undefined || value === null)
        throw new RobotInvalidArgumentError(`Storage entry ${key} is invalid: ${value}`)
      if (value < 0) throw new RobotInvalidArgumentError(`Storage entries ${key} must not be negative: ${value}`)
    }

    return Object.freeze({
      getId: () => id,
      getRobotServiceId: () => robotServiceId,
      isAlive: () => alive,
      getPlayer: () => player,
      getAttributes: () => attributes,
      getLevels: () => levels,
      getInventory: () => ({
        getStorageLevel: () => inventory.storageLevel,
        getUsedStorage: () => Object.values(inventory.storage).reduce((acc, value) => acc + value, 0),
        getMaxStorage: () => inventory.maxStorage,
        getFreeCapacity: () =>
          inventory.maxStorage - Object.values(inventory.storage).reduce((acc, value) => acc + value, 0),
        isFull: () => Object.values(inventory.storage).reduce((acc, value) => acc + value, 0) === inventory.maxStorage,
        getStorage: () => inventory.storage,
      }),
      getCurrentPlanet: () => currentPlanet,
    })
  }
}
