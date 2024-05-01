type EventHeader = {
  type: string
  eventId: string
  transactionId: string
  version: number
  timestamp: strings
}

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

type EventType = keyof EventTypes
