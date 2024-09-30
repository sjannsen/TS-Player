import eventBus from '../../event-handling/event-bus'
import { EventContext } from '../../event-handling/events'
import robotService from '../robot/domain/use-cases'
import getStrategy from './get-strategy'
import getTradingStrategy from './trading-strategy'

const setUpStrategyEventListeners = () => {
  eventBus.subscribe('RoundStatus', async ({ event }: EventContext<'RoundStatus'>) => {
    if (event.payload.roundStatus !== 'started') return
    getTradingStrategy()

    const robots = await robotService.listRobots()
    robots.forEach(robot => getStrategy({ robot }))
  })
}

export { setUpStrategyEventListeners }
