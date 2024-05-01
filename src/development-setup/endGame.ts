import axios from 'axios'
import logger from '../utils/logger'

export default async function endGame(gameId: string) {
  try {
    logger.info(gameId, 'Ending game')
    const response = await axios.post(`/games/${gameId}/gameCommands/end`)
    const { data } = response
    logger.info({ data, gameId }, 'Ended game')
  } catch (error) {
    logger.error(error, 'Error while eding game')
    throw error
  }
}
