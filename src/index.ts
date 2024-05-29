import axios from 'axios'
import dotenv from 'dotenv'
import { clearSetUp, setUpGame, startGame } from './development-setup'
import setUpRabbitMQ from './event-handling/event-consumer'
import setUpEventListeners from './event-handling/setup-event-listener'
import { joinNextGameAvailable, setUpPlayer } from './setup'
import { setUpStateHandlers } from './setup/setUpStateHandlers'
import { updatePlayerConfig } from './shared/config'
import { Game, Player } from './shared/types'
import logger from './utils/logger'

dotenv.config()

axios.defaults.baseURL = process.env.GAME_URL ?? 'http://localhost:8080'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled rejection: ${err}`)
})

process.on('uncaughtException', (err, origin) => {
  logger.error(`Uncaught exception (origin: ${origin}) err: ${err}\t at ${err.stack}`)
})

process.on('SIGTERM', (signal) => logger.error(`Received Sigterm: ${signal}`))
process.on('beforeExit', (code) => {
  logger.warn(`Process will exit with code: ${code}`)
  process.exit(code)
})

process.on('exit', (code) => {
  logger.warn(`Process exited with code: ${code}`)
})

const devMode = process.env.ENVIROMENT == 'dev'

async function main() {
  if (devMode) {
    logger.info('Starting in Dev Mode')
    await clearSetUp()
    await setUpGame()
  }

  const playerName = process.env.PLAYER_NAME
  const playerEmail = process.env.PLAYER_EMAIL
  if (!playerName || !playerEmail) {
    logger.error('Name or email of player is undefined. Cancelling setup')
    throw new Error('Player undefined')
  }

  logger.info({ playerName, playerEmail }, 'SetUp Player')
  const player: Player = await setUpPlayer(playerName, playerEmail)

  logger.info({ playerId: player.playerId, playerExchange: player.playerExchange }, 'SetUp RabbitMQ')
  await setUpRabbitMQ(player.playerId, player.playerExchange)
  updatePlayerConfig(player)

  setUpStateHandlers()
  setUpEventListeners()

  const game: Game = await joinNextGameAvailable()
  if (devMode) await startGame(game.gameId)
}
main()

// clearSetUp()
