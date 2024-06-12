import { connectToNeo4j } from '../../../../../db/neo4j-connection'
import eventBus from '../../../../../event-handling/event-bus'
import { EventContext, Event, EventHeader, EventPayload } from '../../../../../event-handling/events'
import setUpEventListeners from '../../../../../event-handling/setup-event-listener'
import { setUpStateHandlers } from '../../../../../setup/setUpStateHandlers'
import { Player } from '../../../../../shared/types'
import logger from '../../../../../utils/logger'
import { getPlanet } from '../../../domain/use-cases'

export default async function testDatabase() {
  connectToNeo4j()

  const header: EventHeader = {
    eventId: 'eventId',
    timestamp: 'timeStamp',
    transactionId: 'transactionId',
    type: 'PlanetDiscovered',
    version: 1,
  }

  const playerContext: Player = {
    email: 'test@example.com',
    name: 'test',
    playerExchange: 'test-all',
    playerId: 'testId',
  }

  const gameStatusPayload: EventPayload<'GameStatus'> = {
    gameId: 'gameId',
    gameworldId: 'gameworldId',
    status: 'started',
  }
  const gameStatusEvent: Event<'GameStatus'> = {
    header,
    payload: gameStatusPayload,
  }

  const gameStatusContext: EventContext<'GameStatus'> = {
    event: gameStatusEvent,
    playerContext,
    type: 'GameStatus',
  }

  const payload1: EventPayload<'PlanetDiscovered'> = {
    planet: 'mapServiceId1',
    movementDifficulty: 1,
    neighbours: [
      {
        id: 'mapServiceId2',
        direction: 'NORTH',
      },
      {
        id: 'mapServiceId3',
        direction: 'WEST',
      },
    ],
    resource: null,
  }

  const payload2: EventPayload<'PlanetDiscovered'> = {
    planet: 'mapServiceId2',
    movementDifficulty: 1,
    neighbours: [
      {
        id: 'mapServiceId4',
        direction: 'NORTH',
      },
      {
        id: 'mapServiceId1',
        direction: 'SOUTH',
      },
    ],
    resource: null,
  }

  const payload3: EventPayload<'PlanetDiscovered'> = {
    planet: 'mapServiceId4',
    movementDifficulty: 1,
    neighbours: [
      {
        id: 'mapServiceId2',
        direction: 'SOUTH',
      },
    ],
    resource: {
      resourceType: 'COAL',
      currentAmount: 1000,
      maxAmount: 1000,
    },
  }

  const event1: Event<'PlanetDiscovered'> = {
    header,
    payload: payload1,
  }
  const event2: Event<'PlanetDiscovered'> = {
    header,
    payload: payload2,
  }
  const event3: Event<'PlanetDiscovered'> = {
    header,
    payload: payload3,
  }

  const eventContext1: EventContext<'PlanetDiscovered'> = {
    type: 'PlanetDiscovered',
    event: event1,
    playerContext,
  }

  const eventContext2: EventContext<'PlanetDiscovered'> = {
    type: 'PlanetDiscovered',
    event: event2,
    playerContext,
  }

  const eventContext3: EventContext<'PlanetDiscovered'> = {
    type: 'PlanetDiscovered',
    event: event3,
    playerContext,
  }

  setUpEventListeners()
  setUpStateHandlers()

  eventBus.publish('GameStatus', gameStatusContext)

  setTimeout(() => {
    console.log('Event1')
    eventBus.publish('PlanetDiscovered', eventContext1)
  }, 0)

  setTimeout(() => {
    console.log('Event2')
    eventBus.publish('PlanetDiscovered', eventContext2)
  }, 5000)

  setTimeout(() => {
    console.log('Event3')
    eventBus.publish('PlanetDiscovered', eventContext3)
  }, 7000)

  setTimeout(async () => {
    const planet = await getPlanet({ mapServiceId: 'mapServiceId1' })
    logger.info({ planet }, 'AAA')
  }, 10000)

  setTimeout(() => {
    eventBus.publish('GameStatus', {
      playerContext,
      type: 'GameStatus',
      event: {
        header,
        payload: { gameId: 'gameId', gameworldId: 'gameWorldId', status: 'ended' },
      },
    })
  }, 12000)
}
