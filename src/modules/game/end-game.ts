import eventBus from '../../event-handling/event-bus'
import { EventContext } from '../../event-handling/events'
import { joinNextGameAvailable } from '../../setup'
import logger from '../../utils/logger'

export default function setUpGameEndListener() {
  eventBus.subscribe('GameStatus', async ({ event }: EventContext<'GameStatus'>) => {
    if (event.payload.status === 'ended') {
      logger.info('Game ended, shutting down service... 👌☕')
    }
    const game = await joinNextGameAvailable()
    logger.info({ game }, `Joined the next game 🤖`)
  })
}
