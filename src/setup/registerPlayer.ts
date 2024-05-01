import axios from 'axios'
import { Player } from '../types'
import logger from '../utils/logger'

export default async function registerPlayer(name: string, email: string): Promise<Player> {
  try {
    const response = await axios.post('/players', { name, email })
    const data: Player = response.data

    logger.info({ name, email }, 'Registered the player')
    return data
  } catch (error) {
    if (axios.isAxiosError(error))
      logger.error({ message: error.message, response: error.response }, 'Axios error while registering the player')
    else logger.error(error, 'Error while registering the player')
    throw error
  }
}
