import { startGame } from "../../development-setup"
import eventBus from "../../event-handling/event-bus"
import { EventContext } from "../../event-handling/events"
import { getAvailableGames } from "../../setup"
import getPlayer from "../../setup/getPlayer"
import joinGame from "../../setup/joinGame"
import { Game } from "../../shared/types"
import logger from "../../utils/logger"

export default function setUpGameCreatedHandler() {
    eventBus.subscribe('GameStatus', async ({ event }: EventContext<'GameStatus'>) => {
        if (event.payload.status != 'created') return
         logger.info({ game: event.payload }, 'GAME CREATED. Time to crush them all!!! 🥷🥷🥷🥷💀💀💀💀🔥🔥🔥🔥')

         const playerName = process.env.PLAYER_NAME
         const playerEmail = process.env.PLAYER_EMAIL

         if (!playerName || !playerEmail) throw new Error('Player is undefined 😐. Please define a name and an email for the player')

         const player = await getPlayer(playerName, playerEmail)
         const availableGames: Game[] = await getAvailableGames()
         const createdGame = availableGames.find((game) => game.gameStatus == 'created')

         if (!createdGame) {
           logger.info('No created game found, can not do anything about it 😅')
           return
         }

         const isAlreadyParticipating = createdGame?.participatingPlayers.includes(player.name)
         if (isAlreadyParticipating) {
           logger.info('The Player aready joined a game WTF?! 🤡🔪🩸')
           return
         }

         await joinGame(createdGame, player)
         const devMode = process.env.ENVIROMENT == 'dev'
         if (devMode) {
            logger.info('Starting the game, get ready... 👻💥')
            await startGame(event.payload.gameId)
         }
     })
}
