import { Game, Player } from '../types'
import logger from '../utils/logger'

type JoinNextAvailableGameProps = {
  getAvailableGames: () => Promise<Game[]>
  getPlayer: (name: string, email: string) => Promise<Player>
  joinGame: (game: Game, player: Player) => Promise<unknown>
}

export default async function joinNextAvailableGame({
  getAvailableGames,
  getPlayer,
  joinGame,
}: JoinNextAvailableGameProps): Promise<Game> {
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

      if (!createdGame) return

      const isAlreadyParticipating = createdGame?.participatingPlayers.includes(player.name)
      if (isAlreadyParticipating) {
        logger.info('The Player aready joined a game?!🤡')
        clearInterval(joinInIntervall)
        resolve(createdGame)
        return
      }

      await joinGame(createdGame, player)
      logger.info('Ending joining interval')

      clearInterval(joinInIntervall)
      resolve(createdGame)
    }, 5000)
  })
}
