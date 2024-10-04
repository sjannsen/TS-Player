import { Event, EventContext, EventHeader, EventPayload } from '../../../../../event-handling/events'
import { playerContext } from './player-context-setup'

const tradablePricesHeader: EventHeader = {
  eventId: 'eventId',
  timestamp: 'timeStamp',
  transactionId: 'transactionId',
  type: 'TradablePrices',
  version: 1,
}

const tradablePricesPayload: EventPayload<'TradablePrices'> = [
  {
    type: 'UPGRADE',
    name: 'MINING_1',
    price: 50,
  },
  {
    type: 'UPGRADE',
    name: 'MINING_2',
    price: 100,
  },
  {
    type: 'UPGRADE',
    name: 'MINING_3',
    price: 150,
  },
  {
    type: 'ITEM',
    name: 'ROBOT',
    price: 100,
  },
]

const tradablePricesEvent: Event<'TradablePrices'> = {
  header: tradablePricesHeader,
  payload: tradablePricesPayload,
}

const tradablePricesEventContext: EventContext<'TradablePrices'> = {
  type: 'TradablePrices',
  event: tradablePricesEvent,
  playerContext,
}

const bankAccountInitializedHeader: EventHeader = {
  eventId: 'eventId',
  timestamp: 'timeStamp',
  transactionId: 'transactionId',
  type: 'BankAccountInitialized',
  version: 1,
}

const bankAccountInitializedPayload: EventPayload<'BankAccountInitialized'> = {
  balance: 500,
  playerId: 'bigdaddy-6969',
}

const bankAccountInitializedEvent: Event<'BankAccountInitialized'> = {
  header: bankAccountInitializedHeader,
  payload: bankAccountInitializedPayload,
}

const bankAccountInitializedEventContext: EventContext<'BankAccountInitialized'> = {
  type: 'BankAccountInitialized',
  event: bankAccountInitializedEvent,
  playerContext,
}

export { tradablePricesEventContext, bankAccountInitializedEventContext }
