import eventBus from '../../event-handling/event-bus'
import { EventContext } from '../../event-handling/events'
import getMiningStrategy from './mining-strategy'
import getMovementStrategy from './movement-strategy'
import getTradingStrategy from './trading-strategy'

const setUpStrategyEventListeners = () => {
  eventBus.subscribe('RoundStatus', async ({ event }: EventContext<'RoundStatus'>) => {
    if (event.payload.roundStatus !== 'started') return
    const roundNumber = event.payload.roundNumber
    getTradingStrategy(roundNumber)
    getMovementStrategy()
    getMiningStrategy()
  })
}

export { setUpStrategyEventListeners }
