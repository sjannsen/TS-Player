import { Event, EventContext, EventHeader, EventPayload } from '../../../../../event-handling/events'
import { playerContext } from './player-context-setup'

const RobotSpawnedPayload: EventPayload<'RobotSpawned'> = {
  robot: {
    id: 'robot-I',
    player: 'bigdaddy-6969',
    planet: {
      planetId: 'planet-2',
      x: 1,
      y: 0,
      movementDifficulty: 1,
      ressource: null!,
    },
    alive: true,
    maxHealth: 10,
    maxEnergy: 10,
    energyRegen: 10,
    attackDamage: 10,
    miningSpeed: 10,
    health: 10,
    energy: 100,
    healthLevel: 0,
    damageLevel: 0,
    miningSpeedLevel: 0,
    miningLevel: 0,
    energyLevel: 0,
    energyRegenLevel: 0,
    storageLevel: 0,
    inventory: {
      storageLevel: 0,
      usedStorage: 0,
      maxStorage: 10,
      full: false,
      resources: {
        COAL: 0,
        IRON: 0,
        GEM: 0,
        GOLD: 0,
        PLATIN: 0,
      },
    },
  },
}
const RobotSpawnedPayload2: EventPayload<'RobotSpawned'> = {
  robot: {
    id: 'robot-II',
    player: 'bigdaddy-6969',
    planet: {
      planetId: 'planet-3',
      x: 0,
      y: 1,
      movementDifficulty: 1,
      ressource: null!,
    },
    alive: true,
    maxHealth: 10,
    maxEnergy: 10,
    energyRegen: 10,
    attackDamage: 10,
    miningSpeed: 10,
    health: 10,
    energy: 100,
    healthLevel: 0,
    damageLevel: 0,
    miningSpeedLevel: 0,
    miningLevel: 0,
    energyLevel: 0,
    energyRegenLevel: 0,
    storageLevel: 0,
    inventory: {
      storageLevel: 0,
      usedStorage: 0,
      maxStorage: 10,
      full: false,
      resources: {
        COAL: 0,
        IRON: 0,
        GEM: 0,
        GOLD: 0,
        PLATIN: 0,
      },
    },
  },
}

const RobotSpawnedPayload3: EventPayload<'RobotSpawned'> = {
  robot: {
    id: 'robot-III',
    player: 'bigdaddy-6969',
    planet: {
      planetId: 'planet-4',
      x: 1,
      y: 1,
      movementDifficulty: 1,
      ressource: null!,
    },
    alive: true,
    maxHealth: 10,
    maxEnergy: 10,
    energyRegen: 10,
    attackDamage: 10,
    miningSpeed: 10,
    health: 10,
    energy: 100,
    healthLevel: 0,
    damageLevel: 0,
    miningSpeedLevel: 0,
    miningLevel: 0,
    energyLevel: 0,
    energyRegenLevel: 0,
    storageLevel: 0,
    inventory: {
      storageLevel: 0,
      usedStorage: 0,
      maxStorage: 10,
      full: false,
      resources: {
        COAL: 0,
        IRON: 0,
        GEM: 0,
        GOLD: 0,
        PLATIN: 0,
      },
    },
  },
}

const robotSpawnedHeader: EventHeader = {
  eventId: 'eventId',
  timestamp: 'timeStamp',
  transactionId: 'transactionId',
  type: 'RobotSpawned',
  version: 1,
}

const robotSpawnedEvent1: Event<'RobotSpawned'> = {
  header: robotSpawnedHeader,
  payload: RobotSpawnedPayload,
}
const robotSpawnedEvent2: Event<'RobotSpawned'> = {
  header: robotSpawnedHeader,
  payload: RobotSpawnedPayload2,
}
const robotSpawnedEvent3: Event<'RobotSpawned'> = {
  header: robotSpawnedHeader,
  payload: RobotSpawnedPayload3,
}

const robotSpawnedEventContext1: EventContext<'RobotSpawned'> = {
  type: 'RobotSpawned',
  event: robotSpawnedEvent1,
  playerContext,
}

const robotSpawnedEventContext2: EventContext<'RobotSpawned'> = {
  type: 'RobotSpawned',
  event: robotSpawnedEvent2,
  playerContext,
}

const robotSpawnedEventContext3: EventContext<'RobotSpawned'> = {
  type: 'RobotSpawned',
  event: robotSpawnedEvent3,
  playerContext,
}

export { robotSpawnedEventContext1, robotSpawnedEventContext2, robotSpawnedEventContext3 }
