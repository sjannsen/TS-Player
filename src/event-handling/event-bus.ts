import { EventEmitter } from 'stream'
import { Event, EventContext, EventHeader, EventPayload, EventType } from './events'

const eventEmitter = new EventEmitter()

const eventPayload: EventPayload<'GameStatus'> = {
  gameId: 'a',
  gameworldId: 'b',
  status: 'created',
}

const header: EventHeader = {
  eventId: 's',
  timestamp: 'a',
  transactionId: 'b',
  type: 'GameStatus',
  version: 1,
}

const event: Event<'GameStatus'> = {
  header: header,
  payload: eventPayload,
}

export const eventContext: EventContext<'GameStatus'> = {
  type: 'GameStatus',
  event: event,
  playerContext: {
    email: 'a',
    name: '',
    playerExchange: 'a',
    playerId: 'a',
  },
}

function subscribe<T extends EventType>(eventName: T, listener: (eventContext: EventContext<T>) => void) {
  eventEmitter.on(eventName, listener)
}

function publish<T extends EventType>(eventName: T, payload: EventContext<T>) {
  eventEmitter.emit(eventName, payload)
}

const eventBus = Object.freeze({
  subscribe,
  publish,
})

export default eventBus
export { subscribe, publish }
