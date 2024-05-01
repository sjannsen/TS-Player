import axios from 'axios'
import logger from '../utils/logger'

export default async function setRoundDuration(gameId: string, duration: number) {
  try {
    const response = await axios.patch(`/games/${gameId}/duration`, { duration })
    const data = response.data
    logger.info({ data, gameId }, 'Updated round duration')
    return data
  } catch (error) {
    logger.error(error, 'Error while setting the round duration')
    throw error
  }
}
