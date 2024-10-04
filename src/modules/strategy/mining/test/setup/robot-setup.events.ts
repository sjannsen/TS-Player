import { Event, EventContext, EventHeader, EventPayload } from '../../../../../event-handling/events'
import { playerContext } from './player-context-setup'

const robotUpgradedHeader: EventHeader = {
  eventId: 'eventId',
  timestamp: 'timeStamp',
  transactionId: 'transactionId',
  type: 'RobotUpgraded',
  version: 1,
}

const robotUpgradedPayload: EventPayload<'RobotUpgraded'> = {
  robotId: 'robot-III',
  level: 1,
  upgrade: 'MINING',
  robot: null!,
}

const robotUpgradedEvent: Event<'RobotUpgraded'> = {
  header: robotUpgradedHeader,
  payload: robotUpgradedPayload,
}

const robotUpgradedEventContext: EventContext<'RobotUpgraded'> = {
  type: 'RobotUpgraded',
  event: robotUpgradedEvent,
  playerContext,
}

const robotMovedHeader: EventHeader = {
  eventId: 'eventId',
  timestamp: 'timeStamp',
  transactionId: 'transactionId',
  type: 'RobotMoved',
  version: 1,
}

const robotMovedPayload: EventPayload<'RobotMoved'> = {
  robotId: 'robot-II',
  fromPlanet: {
    id: 'planet-3',
    movementDifficulty: 1,
  },
  toPlanet: {
    id: 'planet-1',
    movementDifficulty: 1,
  },
  remainingEnergy: 100,
}

const robotMovedEvent: Event<'RobotMoved'> = {
  header: robotMovedHeader,
  payload: robotMovedPayload,
}

const robotMovedEventContext: EventContext<'RobotMoved'> = {
  type: 'RobotMoved',
  event: robotMovedEvent,
  playerContext,
}

export { robotUpgradedEventContext, robotMovedEventContext }
