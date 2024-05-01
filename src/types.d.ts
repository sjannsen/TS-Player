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
