type GameworldStatus = 'ACTIVE' | 'INACTIVE'

type ResourceType = 'COAL' | 'IRON' | 'GEM' | 'GOLD' | 'PLATIN'

type MinedResource = {
  type: ResourceType
  maxAmount: number
  currentAmount: number
}

type Resource = {
  type: ResourceType
  maxAmount: number
  currentAmount: number
}

type Planet = {
  id: string
  x: number
  y: number
  movementDifficulty: number
  ressource: Resource
}

type Gameworld = {
  id: string
  status: GameworldStatus
  planets: Planet[]
}

type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST'

type Neighbour = {
  id: string
  direction: Direction
}
