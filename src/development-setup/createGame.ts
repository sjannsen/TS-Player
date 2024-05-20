import axios from 'axios'
import { Game } from '../shared/types'
import logger from '../utils/logger'

export default async function createGame(maxRounds: number, maxPlayers: number): Promise<Game> {
  try {
    const response = await axios.post('/games', { maxRounds, maxPlayers })
    const game = response.data
    logger.info(game, 'Created game')
    return game
  } catch (error) {
    logger.error(error, 'Error while creating a game')
    throw error
  }
}
