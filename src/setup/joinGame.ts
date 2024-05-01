import axios from 'axios'
import { Game, Player } from '../types'
import logger from '../utils/logger'

export default async function joinGame(game: Game, player: Player) {
  const isParticipating = game.participatingPlayers.includes(player.name)

  if (isParticipating) {
    logger.info('Player is already participating in a game')
    return
  }

  const canRegister = game.gameStatus == 'created'
  if (!canRegister) {
    logger.warn('Cannot register player for a game because gameStatus does not allow so')
    return
  }

  try {
    const playerId = player.playerId
    const response = await axios.put(`/games/${game.gameId}/players/${player.playerId}`, { playerId })

    const { data } = response
    logger.info(data, 'Sucessfully joined the game')

    return response.data
  } catch (error) {
    logger.error(error, 'Error while joining the game')
    throw error
  }
}
