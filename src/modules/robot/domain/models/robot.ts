import { Id } from '../Id'
import { RobotInvalidArgumentError } from './robot.errors'
import { RobotAttributes, RobotLevels } from './types'

export type Robot = {
  getId: () => string
  getRobotServiceId: () => string
  isAlive: () => boolean
  getPlayer: () => string
  getAttributes: () => RobotAttributes
  getLevels: () => RobotLevels
  getInventoryId: () => string | undefined
  getCurrentPlanet: () => string
}

type MakeRobotDependencies = {
  Id: Id
}

export type RobotData = {
  id?: string
  robotServiceId: string
  alive: boolean
  player: string
  attributes: RobotAttributes
  levels: RobotLevels
  inventoryId?: string
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
    inventoryId,
    currentPlanet,
  }: RobotData): Robot {
    if (!Id.isValidId(id)) throw new RobotInvalidArgumentError(`Id is invalid: ${id}`)
    if (!robotServiceId) throw new RobotInvalidArgumentError(`robotServiceId is invalid: ${id}`)
    if (!player) throw new RobotInvalidArgumentError(`Player is required`)
    if (!attributes) throw new RobotInvalidArgumentError(`Attributes is required`)
    if (!levels) throw new RobotInvalidArgumentError(`Levels is required`)
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

    return Object.freeze({
      getId: () => id,
      getRobotServiceId: () => robotServiceId,
      isAlive: () => alive,
      getPlayer: () => player,
      getAttributes: () => attributes,
      getLevels: () => levels,
      getInventoryId: () => inventoryId,
      getCurrentPlanet: () => currentPlanet,
      mineResource: () => {},
    })
  }
}
