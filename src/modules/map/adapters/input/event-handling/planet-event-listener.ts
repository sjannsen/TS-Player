import eventBus from '../../../../../event-handling/event-bus'
import { Direction } from '../../../../../shared/types'
import logger from '../../../../../utils/logger'
import { NeighborPlanets } from '../../../domain/model/planet'
import planetService from '../../../domain/use-cases'

export default function setUpPlanetEventListeners() {
  eventBus.subscribe('PlanetDiscovered', ({ event }) => {
    const { planet, movementDifficulty, resource, neighbours } = event.payload

    const neighborPlanets: NeighborPlanets = {
      NORTH: undefined,
      EAST: undefined,
      SOUTH: undefined,
      WEST: undefined,
    }
    neighbours.forEach((neighbor: { id: string; direction: Direction }) => {
      neighborPlanets[neighbor.direction] = neighbor.id
    })

    try {
      planetService.createPlanet({ mapServiceId: planet, movementDifficulty, resource, neighborPlanets })
    } catch (error) {
      logger.error(error, 'Error while processing PlanetDiscovered event')
      process.exit(5)
    }
  })

  eventBus.subscribe('ResourceMined', ({ event }) => {
    const { planet, minedAmount } = event.payload
    try {
      planetService.mineResource({ id: planet, amount: minedAmount })
    } catch (error) {
      logger.error(error, 'Error while processing ResourceMined event')
      process.exit(5)
    }
  })
}
