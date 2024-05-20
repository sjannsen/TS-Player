import axios from 'axios'
import { Game } from '../shared/types'
import logger from '../utils/logger'

export default async function getAvailableGames(): Promise<Game[]> {
  try {
    const response = await axios.get('/games')
    const games: Game[] = response.data
    logger.info(games, 'Got available games')

    return games
  } catch (error) {
    logger.error(error, 'Error while getting available games')
    throw error
  }
}
