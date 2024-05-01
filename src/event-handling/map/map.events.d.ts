type GameworldCreatedEvent = {
  id: string
  status: GameworldStatus
  planets: Planet[]
}

type GameworldStatusChangedEvent = {
  id: string
  stauts: GameworldStatus
}

type ResourceMinedEvent = {
  planet: string
  minedAmount: number
  resource: MinedResource
}

type PlanetDiscoveredEvent = {
  planet: string
  movementDifficulty: number
  neighbours: Array<Neighbour>
  resource: Resource
}
