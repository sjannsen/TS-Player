import { Game, Player } from '../shared/types'
import logger from '../utils/logger'

type JoinNextAvailableGameProps = {
  getAvailableGames: () => Promise<Game[]>
  getPlayer: (name: string, email: string) => Promise<Player>
  joinGame: (game: Game, player: Player) => Promise<unknown>
}

let isJoining = false

export default async function joinNextAvailableGame({
  getAvailableGames,
  getPlayer,
  joinGame,
}: JoinNextAvailableGameProps): Promise<Game> {
  if (isJoining) {
    logger.error('Already in joining intervall')
    Promise.reject(new Error('Already in joining process'))
  }
  isJoining = true

  return new Promise((resolve, reject) => {
    const joinInIntervall = setInterval(async () => {
      logger.info('Beginning joining intervall')
      const playerName = process.env.PLAYER_NAME
      const playerEmail = process.env.PLAYER_EMAIL

      if (!playerName || !playerEmail) {
        logger.error('Cannot join a game because name or email of player is undefined')
        clearInterval(joinInIntervall)
        reject(new Error('Player undefined'))
        return
      }
      const player = await getPlayer(playerName, playerEmail)
      const availableGames: Game[] = await getAvailableGames()
      const createdGame = availableGames.find((game) => game.gameStatus == 'created')

      if (!createdGame) {
        logger.info('No created game found')
        return
      }

      const isAlreadyParticipating = createdGame?.participatingPlayers.includes(player.name)
      if (isAlreadyParticipating) {
        logger.info('The Player aready joined a game?!🤡')
        clearInterval(joinInIntervall)
        isJoining = false
        resolve(createdGame)
        return
      }

      await joinGame(createdGame, player)
      logger.info('Ending joining interval')

      clearInterval(joinInIntervall)
      logger.info('Cleared intervall after joining')
      isJoining = false
      resolve(createdGame)
      logger.info('After resolve')
    }, 5000)
  })
}
