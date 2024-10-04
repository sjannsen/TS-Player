import { Event, EventContext, EventHeader, EventPayload } from '../../../../../event-handling/events'
import playerContext from './player-context-setup'

const header: EventHeader = {
  eventId: 'eventId',
  timestamp: 'timeStamp',
  transactionId: 'transactionId',
  type: 'PlanetDiscovered',
  version: 1,
}

const payload1: EventPayload<'PlanetDiscovered'> = {
  planet: 'planet-1',
  movementDifficulty: 1,
  neighbours: [
    {
      id: 'planet-2',
      direction: 'EAST',
    },
    {
      id: 'planet-4',
      direction: 'SOUTH',
    },
  ],
  resource: {
    resourceType: 'COAL',
    maxAmount: 10000,
    currentAmount: 10000,
  },
}

const payload2: EventPayload<'PlanetDiscovered'> = {
  planet: 'planet-2',
  movementDifficulty: 1,
  neighbours: [
    {
      id: 'planet-1',
      direction: 'EAST',
    },
    {
      id: 'planet-3',
      direction: 'SOUTH',
    },
  ],
  resource: {
    resourceType: 'COAL',
    maxAmount: 10000,
    currentAmount: 10000,
  },
}

const payload3: EventPayload<'PlanetDiscovered'> = {
  planet: 'planet-3',
  movementDifficulty: 1,
  neighbours: [
    {
      id: 'planet-1',
      direction: 'NORTH',
    },
    {
      id: 'planet-4',
      direction: 'EAST',
    },
  ],
  resource: null,
}

const payload4: EventPayload<'PlanetDiscovered'> = {
  planet: 'planet-4',
  movementDifficulty: 1,
  neighbours: [
    {
      id: 'planet-2',
      direction: 'NORTH',
    },
    {
      id: 'planet-3',
      direction: 'WEST',
    },
  ],
  resource: {
    resourceType: 'IRON',
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
const event4: Event<'PlanetDiscovered'> = {
  header,
  payload: payload4,
}

const planetDiscoveredEventContext1: EventContext<'PlanetDiscovered'> = {
  type: 'PlanetDiscovered',
  event: event1,
  playerContext,
}

const planetDiscoveredEventContext2: EventContext<'PlanetDiscovered'> = {
  type: 'PlanetDiscovered',
  event: event2,
  playerContext,
}

const planetDiscoveredEventContext3: EventContext<'PlanetDiscovered'> = {
  type: 'PlanetDiscovered',
  event: event3,
  playerContext,
}
const planetDiscoveredEventContext4: EventContext<'PlanetDiscovered'> = {
  type: 'PlanetDiscovered',
  event: event4,
  playerContext,
}

export {
  planetDiscoveredEventContext1,
  planetDiscoveredEventContext2,
  planetDiscoveredEventContext3,
  planetDiscoveredEventContext4,
}
