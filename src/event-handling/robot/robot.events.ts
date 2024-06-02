import { InventoryResources } from '../../modules/robot/domain/models/types'
import {
  FullRobot,
  PlanetMovement,
  ResourceType,
  RevealedRobotLevels,
  RobotFightResultPayload,
  UpgradeType,
} from './robot.types'

export type RobotAttackedEvent = {
  attacker: RobotFightResultPayload
  target: RobotFightResultPayload
}

export type RobotMovedEvent = {
  robotId: string
  remainingEnergy: number
  fromPlanet: PlanetMovement
  toPlanet: PlanetMovement
}

export type RobotRegeneratedEvent = {
  robotId: string
  availableEnergy: number
}

export type RobotResourceMinedEvent = {
  robotId: string
  minedAmount: number
  minedResource: ResourceType
  resourceInventory: InventoryResources
}

export type RobotResourceRemovedEvent = {
  robotId: string
  removedAmount: number
  removedResource: ResourceType
  resourceInventory: InventoryResources
}

export type RobotRestoredAttributesEvent = {
  robotId: string
  restorationType: 'HEALTH' | 'ENERGY'
  availableEnergy: number
  availableHealth: number
}

export type RobotSpawnedEvent = {
  robot: FullRobot
}

export type RobotUpgradedEvent = {
  robotId: string
  level: number
  upgrade: UpgradeType
  robot: FullRobot
}

export type RobotsRevealed = {
  robotId: string
  planetId: string
  playerNotion: string
  health: number
  energy: number
  levels: RevealedRobotLevels
}

export type RobotsRevealedEvent = Array<RobotsRevealed>
