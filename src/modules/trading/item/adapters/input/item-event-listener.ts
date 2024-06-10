import eventBus from '../../../../../event-handling/event-bus'
import { EventContext } from '../../../../../event-handling/events'
import { TradablePrice } from '../../../../../event-handling/trading/trading.types'
import logger from '../../../../../utils/logger'
import itemService from '../../domain/use-cases'

export default function setUpItemEventListeners() {
  eventBus.subscribe('TradablePrices', async ({ event }: EventContext<'TradablePrices'>) => {
    const items: TradablePrice[] = event.payload

    items.forEach(async (item) => {
      const { type, name, price } = item
      await itemService.inserItem({ itemData: { type, name, price } })
    })
    logger.error({ event: event.payload }, 'TRADABLE PRICES')
  })
}
