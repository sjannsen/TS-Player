import { Event, EventContext, EventHeader, EventPayload } from '../../../../../event-handling/events'
import playerContext from './player-context-setup'

const roundStatusHeader: EventHeader = {
    eventId: 'eventId',
    timestamp: 'timeStamp',
    transactionId: 'transactionId',
    type: 'RoundStatus',
    version: 1,
  }

  const roundStatusPayload: EventPayload<'RoundStatus'> = {
    gameId: 'i',
    roundId: 'roundId-1',
    roundNumber: 1,
    roundStatus: 'started',
    impreciseTimings: null!
  }

  const roundStatusPayload2: EventPayload<'RoundStatus'> = {
    gameId: 'i',
    roundId: 'roundId-2',
    roundNumber: 2,
    roundStatus: 'started',
    impreciseTimings: null!
  }
  const roundStatusPayload3: EventPayload<'RoundStatus'> = {
    gameId: 'i',
    roundId: 'roundId-3',
    roundNumber: 3,
    roundStatus: 'started',
    impreciseTimings: null!
  }

  const roundStatusEvent: Event<'RoundStatus'> = {
    header: roundStatusHeader,
    payload: roundStatusPayload,
  }

  const roundStatusEvent2: Event<'RoundStatus'> = {
    header: roundStatusHeader,
    payload: roundStatusPayload2,
  }

  const roundStatusEvent3: Event<'RoundStatus'> = {
    header: roundStatusHeader,
    payload: roundStatusPayload3,
  }

  const roundStatusEventContext: EventContext<'RoundStatus'> = {
    type: 'RoundStatus',
    event: roundStatusEvent,
    playerContext,
  }
  const roundStatusEventContext2: EventContext<'RoundStatus'> = {
    type: 'RoundStatus',
    event: roundStatusEvent2,
    playerContext,
  }
  const roundStatusEventContext3: EventContext<'RoundStatus'> = {
    type: 'RoundStatus',
    event: roundStatusEvent3,
    playerContext,
  }

  export { roundStatusEventContext, roundStatusEventContext2, roundStatusEventContext3 }
