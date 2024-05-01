type RobotFightResult = {
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

type RobotLevels = {
  healthLevel: number
  damageLevel: number
  miningSpeedLevel: number
  miningLevel: number
  energyLevel: number
  energyRegenLevel: number
}

type RobotAttributes = {
  maxHealth: number
  maxEnergy: number
  energyRegen: number
  attackDamage: number
  miningSpeed: number
  health: number
  energy: number
}

type RobotInventory = {
  storageLevel: number
  usedStorage: number
  maxStorage: number
  full: boolean
  resources: InventoryResources
}

type InventoryResources = {
  COAL: number
  IRON: number
  GEM: number
  GOLD: number
  PLATIN: number
}

type FullRobot = {
  planet: Planet
  inventory: RobotInventory
} & Robot

type Robot = {
  id: string
  alive: boolean
  player: string
} & RobotAttributes &
  RobotLevels

type ResourceType = 'COAL' | 'IRON' | 'GEM' | 'GOLD' | 'PLATIN'
