export type GameworldStatus = 'ACTIVE' | 'INACTIVE'

export type ResourceType = 'COAL' | 'IRON' | 'GEM' | 'GOLD' | 'PLATIN'
export type MinedResource = {
  type: ResourceType
  maxAmount: number
  currentAmount: number
}

export type Resource = {
  resourceType: ResourceType
  maxAmount: number
  currentAmount: number
}

export type Planet = {
  id: string
  x: number
  y: number
  movementDifficulty: number
  ressource: Resource
}

export type Gameworld = {
  id: string
  status: GameworldStatus
  planets: Planet[]
}

export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST'

export type Neighbour = {
  id: string
  direction: Direction
}
