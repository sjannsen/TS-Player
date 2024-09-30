import eventBus from '../../event-handling/event-bus'
import { EventContext } from '../../event-handling/events'
import robotService from '../robot/domain/use-cases'
import getStrategy from './get-strategy'
import getMiningStrategy from './mining-strategy'
import getMovementStrategy from './movement-strategy'
import getTradingStrategy from './trading-strategy'

const setUpStrategyEventListeners = () => {
  eventBus.subscribe('RoundStatus', async ({ event }: EventContext<'RoundStatus'>) => {
    if (event.payload.roundStatus !== 'started') return
    const roundNumber = event.payload.roundNumber
    const robots = await robotService.listRobots()
    robots.forEach(robot => getStrategy({ robot }))
    // getTradingStrategy(roundNumber)
    // getMovementStrategy()
    // getMiningStrategy()
  })
}

export { setUpStrategyEventListeners }
