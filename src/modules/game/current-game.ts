import eventBus from '../../event-handling/event-bus'
import { EventContext } from '../../event-handling/events'
import logger from '../../utils/logger'

let currentGameId: string | null = null

export function setUpCurrentGameHandler() {
  eventBus.subscribe('GameStatus', ({ event }: EventContext<'GameStatus'>) => {
    if (!currentGameId) currentGameId = event.payload.gameId
  })
}

export function getCurrentGameId() {
  logger.info({ gameId: currentGameId }, 'Get Current GameID')
  return currentGameId
}
