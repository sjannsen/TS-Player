import { Player } from './types'

let player: Player = {
  playerId: '',
  name: '',
  email: '',
  playerExchange: '',
}

export function updatePlayerConfig(updatedPlayer: Player) {
  player = updatedPlayer
}

export function getPlayer() {
  return player
}
