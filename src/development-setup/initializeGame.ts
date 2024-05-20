import { Game } from '../shared/types'
import logger from '../utils/logger'

const maxRounds = 10_000
const maxPlayers = 10
const RoundDuration = 4_000

type InitializeGameProps = {
  createGame: (maxRounds: number, maxPlayers: number) => Promise<Game>
  getAvailableGames: () => Promise<Game[]>
  setRoundDuration: (gameId: string, duration: number) => Promise<unknown>
  clearStartedGames: () => Promise<unknown>
}

export default async function initializeGame({
  createGame,
  getAvailableGames,
  setRoundDuration,
  clearStartedGames,
}: InitializeGameProps) {
  const availableGames: Game[] = await getAvailableGames()
  const startedGames = availableGames.filter((game) => game.gameStatus == 'started')
  const createdGames = availableGames.filter((game) => game.gameStatus == 'created')

  if (startedGames.length > 0) {
    logger.info(startedGames, 'A game is already running. Skipping initialization')
    if (!process.env.FORCE) return
    logger.info('Force clearing started games')
    await clearStartedGames()
  }

  const gameIds = createdGames.map((game) => game.gameId)
  if (createdGames.length == 0) {
    logger.info('No games available. Creating a new game')
    const game = await createGame(maxRounds, maxPlayers)
    gameIds.push(game.gameId)
  }

  await Promise.all(gameIds.map((gameId) => setRoundDuration(gameId, RoundDuration)))
}
