import axios from 'axios'
import { Player } from '../shared/types'
import logger from '../utils/logger'

/**
 * Will only log errors that are not 404 because
 * in order to check, that a player is not already registerd,
 * a 404 response from the gameService is expected
 */
export default async function getPlayer(name: string, email: string): Promise<Player> {
  try {
    const response = await axios.get('/players', {
      params: {
        name,
        mail: email,
      },
    })
    const player = response.data
    logger.info(player, 'Got player')
    return player
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status != 404)
      logger.error(error, 'An error occured while getting the player')
    throw error
  }
}
