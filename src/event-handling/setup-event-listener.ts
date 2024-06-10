import setUpPlanetEventListeners from '../modules/map/adapters/input/event-handling/planet-event-listener'
import setUpRobotEventListeners from '../modules/robot/adapters/input/event-handling/robot-event-listener'
import setUpTradingEventListeners from '../modules/trading/bank-account/adapters/input/event-handling/bankAccount-event-listener'
import setUpItemEventListeners from '../modules/trading/item/adapters/input/item-event-listener'

export default function setUpEventListeners() {
  setUpTradingEventListeners()
  setUpPlanetEventListeners()
  setUpRobotEventListeners()
  setUpItemEventListeners()
}
