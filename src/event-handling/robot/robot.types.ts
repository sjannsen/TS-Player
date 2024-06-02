import { InventoryResources, RobotAttributes, RobotLevels } from '../../modules/robot/domain/models/types'
import { Planet } from '../map/map.types'

export type RobotFightResultPayload = {
  robotId: string
  availableHealth: number
  availableEnergy: number
  alive: boolean
}

export type PlanetMovement = {
  id: string
  movementDifficulty: number
}

export type UpgradeType = 'STORAGE' | 'HEALTH' | 'DAMAGE' | 'MINING_SPEED' | 'MINING' | 'MAX_ENERGY' | 'ENERGY_REGEN'

export type RevealedRobotLevels = {
  healthLevel: number
  damageLevel: number
  miningSpeedLevel: number
  miningLevel: number
  energyLevel: number
  energyRegenLevel: number
  storageLevel: number
}

export type RobotInventoryPayload = {
  storageLevel: number
  usedStorage: number
  maxStorage: number
  full: boolean
  resources: InventoryResources
}

export type FullRobot = {
  planet: Exclude<'id', Planet> & { planetId: string }
  inventory: RobotInventoryPayload
} & RobotPayload

export type RobotPayload = {
  id: string
  alive: boolean
  player: string
} & RobotAttributes &
  RobotLevels

export type ResourceType = 'COAL' | 'IRON' | 'GEM' | 'GOLD' | 'PLATIN'
