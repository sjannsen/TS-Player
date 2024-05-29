type RobotAttackedEvent = {
  attacker: RobotFightResultPayload
  target: RobotFightResultPayload
}

type RobotMovedEvent = {
  robotId: string
  remainingEnergy: number
  fromPlanet: PlanetMovement
  toPlanet: PlanetMovement
}

type RobotRegeneratedEvent = {
  robotId: string
  availableEnergy: number
}

type RobotResourceMinedEvent = {
  robotId: string
  minedAmount: number
  minedResource: ResourceType
  resourceInventory: InventoryResources
}

type RobotResourceRemovedEvent = {
  robotId: string
  removedAmount: number
  removedResource: ResourceType
  resourceInventory: InventoryResources
}

type RobotRestoredAttributesEvent = {
  robotId: string
  restorationType: 'HEALTH' | 'ENERGY'
  availableEnergy: number
  availableHealth: number
}

type RobotSpawnedEvent = {
  robot: FullRobot
}

type RobotUpgradedEvent = {
  robotId: string
  level: number
  upgrade: UpgradeType
  robot: FullRobot
}

type RobotsRevealed = {
  robotId: string
  planetId: string
  playerNotion: string
  health: number
  energy: number
  levels: RevealedRobotLevels
}

type RobotsRevealedEvent = Array<RobotsRevealed>
