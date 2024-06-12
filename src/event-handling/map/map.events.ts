import { GameworldStatus, Planet, MinedResource, Neighbour, Resource } from './map.types'

export type GameworldCreatedEvent = {
  id: string
  status: GameworldStatus
  planets: Planet[]
}

export type GameworldStatusChangedEvent = {
  id: string
  stauts: GameworldStatus
}

export type ResourceMinedEvent = {
  planet: string
  minedAmount: number
  resource: MinedResource
}

export type PlanetDiscoveredEvent = {
  planet: string
  movementDifficulty: number
  neighbours: Array<Neighbour>
  resource: Resource | null | undefined
}
