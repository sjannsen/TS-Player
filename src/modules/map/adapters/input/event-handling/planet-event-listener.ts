import eventBus from '../../../../../event-handling/event-bus'
import { Direction } from '../../../../../shared/types'
import logger from '../../../../../utils/logger'
import { NeighborPlanets } from '../../../domain/model/planet'
import planetService from '../../../domain/use-cases'

export default function setUpPlanetEventListeners() {
  eventBus.subscribe('PlanetDiscovered', async ({ event }) => {
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
      const existing = await planetService.getPlanet({ mapServiceId: planet })
      logger.info({ existing }, 'Existing planet')
      if (!existing)
        await planetService.createPlanet({ mapServiceId: planet, movementDifficulty, resource, neighborPlanets })
      else
        await planetService.updatePlanet({
          id: existing.id,
          mapServiceId: planet,
          movementDifficulty,
          resource,
          neighborPlanets,
        })
    } catch (error) {
      logger.error(error, 'Error while processing PlanetDiscovered event')
      process.exit(5)
    }
  })

  // NOTE: ResourceMined is received for every player, so it has to be filtered
  eventBus.subscribe('ResourceMined', async ({ event }) => {
    const { planet, minedAmount } = event.payload
    const existingPlanet = await planetService.getPlanet({ mapServiceId: planet })
    if (!existingPlanet) return

    try {
      planetService.mineResource({ mapServiceId: planet, amount: minedAmount })
    } catch (error) {
      logger.error(error, 'Error while processing ResourceMined event')
    }
  })
}
