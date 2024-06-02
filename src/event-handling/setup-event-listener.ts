import setUpPlanetEventListeners from '../modules/map/input/event-handling/planet-event-listener'
import setUpTradingEventListeners from '../modules/trading/bank-account/input/event-handling/bankAccount-event-listener'

export default function setUpEventListeners() {
  setUpTradingEventListeners()
  setUpPlanetEventListeners()
}
