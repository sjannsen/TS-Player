export type Game = {
  gameId: string
  gameStatus: string
  participatingPlayers: string[]
}

export type Player = {
  playerId: string
  name: string
  email: string
  playerExchange: string
}

type Direction = 'NORTH' | 'SOUTH' | 'EAST' | 'WEST'

type ResourceType = 'COAL' | 'IRON' | 'GEM' | 'GOLD' | 'PLATIN'

export type UpgradeType = 'STORAGE' | 'HEALTH' | 'DAMAGE' | 'MINING_SPEED' | 'MINING' | 'MAX_ENERGY' | 'ENERGY_REGEN'
