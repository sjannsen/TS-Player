import eventBus from '../../event-handling/eventBus'
import { EventContext } from '../../event-handling/events'
import logger from '../../utils/logger'

let currentRoundNumber: number | null = null
let currentRoundId: string | null = null

export function getCurrentRoundNumber() {
  return currentRoundNumber
}

export function getCurrentRoundId() {
  return currentRoundId
}

export function updateCurrentRound(roundNumber: number, roundId: string) {
  currentRoundNumber = roundNumber
  currentRoundId = roundId
}

export function setUpRoundStatusStateHandler() {
  eventBus.subscribe('RoundStatus', (eventContext: EventContext<'RoundStatus'>) => {
    if (eventContext.event.payload.roundStatus != 'started') return

    const { roundId, roundNumber } = eventContext.event.payload
    updateCurrentRound(roundNumber, roundId)

    const currentRoundNumber = getCurrentRoundNumber()
    logger.info({ currentRoundNumber }, 'Current Round')
  })
}
