type RobotFightResultPayload = {
  robotId: string
  availableHealth: number
  availableEnergy: number
  alive: boolean
}

type PlanetMovement = {
  id: string
  movementDifficulty: number
}

type UpgradeType = 'STORAGE' | 'HEALTH' | 'DAMAGE' | 'MINING_SPEED' | 'MINING' | 'MAX_ENERGY' | 'ENERGY_REGEN'

type RevealedRobotLevels = {
  healthLevel: number
  damageLevel: number
  miningSpeedLevel: number
  miningLevel: number
  energyLevel: number
  energyRegenLevel: number
  storageLevel: number
}

type RobotInventoryPayload = {
  storageLevel: number
  usedStorage: number
  maxStorage: number
  full: boolean
  resources: InventoryResources
}

type FullRobot = {
  planet: Planet
  inventory: RobotInventoryPayload
} & RobotPayload

type RobotPayload = {
  id: string
  alive: boolean
  player: string
} & RobotAttributes &
  RobotLevels

type ResourceType = 'COAL' | 'IRON' | 'GEM' | 'GOLD' | 'PLATIN'
