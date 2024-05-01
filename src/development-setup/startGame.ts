import axios from 'axios'
import logger from '../utils/logger'

export default async function startGame(gameId: string) {
  try {
    logger.info(gameId, 'Starting a game')
    const response = await axios.post(`/games/${gameId}/gameCommands/start`)
    const { data } = response
    logger.info({ data, gameId }, 'Game started')
  } catch (error) {
    logger.error(error, 'Error while starting the game')
    throw error
  }
}
