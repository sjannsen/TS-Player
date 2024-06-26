import { GameStatus } from '../events'
import { RoundStatus } from './game.types'

export type GameStatusEvent = {
  gameId: string
  gameworldId: string
  status: GameStatus
}

export type PlayerStatusEvent = {
  playerId: string
  gameId: string
  name: string
}

export type RoundStatusEvent = {
  gameId: string
  roundId: string
  roundNumber: number
  roundStatus: RoundStatus
  impreciseTimings: {
    roundStarted: string
    commandInputEnded: string
    roundEnded: string
  }
}

export type CommandDispatchedEvent = {
  commandId: string
  player: {
    playerId: string
    username: string
    mailAddress: string
  }
  robot: {
    playerId: string
    robotId: string
    robotStatus: string
  }
  commandType: string
  commandObject: {
    robotId: string
    targetId: string
    itemName: string
    itemQuantity: number
  }
}
