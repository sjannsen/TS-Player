import { Game } from '../types'
import logger from '../utils/logger'

type ClearProps = {
  getAvailableGames: () => Promise<Game[]>
  endGame: (gameId: string) => Promise<void>
}

export default async function clear({ getAvailableGames, endGame }: ClearProps) {
  const availableGames = await getAvailableGames()
  const runningGames = availableGames.filter((game) => game.gameStatus == 'started')
  const runingGamesIds = runningGames.map((game) => game.gameId)

  for (let i = 0; i < runingGamesIds.length; i++) {
    const gameId = runingGamesIds[i]
    await endGame(gameId)
    logger.info(gameId, 'Ended game')
  }
}
