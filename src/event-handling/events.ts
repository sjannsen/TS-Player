import { Player } from '../shared/types'
import { PlayerStatusEvent, RoundStatusEvent, CommandDispatchedEvent } from './game/game.events'
import {
  GameworldCreatedEvent,
  GameworldStatusChangedEvent,
  ResourceMinedEvent,
  PlanetDiscoveredEvent,
} from './map/map.events'
import {
  RobotAttackedEvent,
  RobotMovedEvent,
  RobotRegeneratedEvent,
  RobotResourceMinedEvent,
  RobotResourceRemovedEvent,
  RobotRestoredAttributesEvent,
  RobotSpawnedEvent,
  RobotUpgradedEvent,
  RobotsRevealedEvent,
} from './robot/robot.events'

export type ErrorEvent = {
  playerId: string
  transactionId: string
  robotId: string
  description: string
  code: string
}

interface EventTypes {
  GameStatus: GameStatusEvent
  PlayerStatus: PlayerStatusEvent
  RoundStatus: RoundStatusEvent
  CommandDispatched: CommandDispatchedEvent
  GameworldCreated: GameworldCreatedEvent
  GameworldStatusChanged: GameworldStatusChangedEvent
  ResourceMined: ResourceMinedEvent
  PlanetDiscovered: PlanetDiscoveredEvent
  RobotAttacked: RobotAttackedEvent
  RobotMoved: RobotMovedEvent
  RobotRegenerated: RobotRegeneratedEvent
  RobotResourceMined: RobotResourceMinedEvent
  RobotResourceRemoved: RobotResourceRemovedEvent
  RobotRestoredAttributes: RobotRestoredAttributesEvent
  RobotSpawned: RobotSpawnedEvent
  RobotUpgraded: RobotUpgradedEvent
  RobotsRevealed: RobotsRevealedEvent
  BankAccountCleared: BankAccountClearedEvent
  BankAccountInitialized: BankAccountInitializedEvent
  BankAccountTransactionBooked: BankAccountTransactionBookedEvent
  TradablePrices: TradablePricesEvent
  TradableSold: TradableSoldEvent
  TradableBought: TradableBoughtEvent
  error: ErrorEvent
}

export type EventType = keyof EventTypes

export type EventPayload<T extends EventType> = T extends keyof EventTypes ? EventTypes[T] : unknown

export type EventHeader = {
  type: EventType
  eventId: string
  transactionId: string
  version: number
  timestamp: string
}

export type Event<T extends keyof EventTypes> = {
  header: EventHeader
  payload: EventTypes[T]
}

export type EventContext<T extends keyof EventTypes> = {
  type: T
  event: Event<T>
  playerContext: Player
}

export type GameStatus = 'created' | 'started' | 'ended'

export type GameStatusEvent = {
  gameId: string
  gameworldId: string
  status: GameStatus
}
