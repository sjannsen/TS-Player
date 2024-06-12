import { Direction } from '../../../../shared/types'
import logger from '../../../../utils/logger'
import makePlanet, { Id } from '../model'
import { NeighborPlanets, PlanetResource } from '../model/planet'
import { PlanetDb } from './data-access'

type CreatePlanetDependencies = {
  planetDb: PlanetDb
}

type CreatePlanetProps = {
  id?: string
  mapServiceId: string
  x?: number
  y?: number
  movementDifficulty: number
  resource?: PlanetResource | null | undefined
  neighborPlanets: NeighborPlanets
}

export default function makeCreatePlanet({ planetDb }: CreatePlanetDependencies) {
  return async function createPlanet({
    mapServiceId,
    x,
    y,
    movementDifficulty,
    resource,
    neighborPlanets,
  }: CreatePlanetProps) {
    logger.info({ mapServiceId }, 'Create planet')

    const exist = await planetDb.findByMapServiceId({ mapServiceId })
    if (exist) return exist

    logger.info({ mapServiceId }, 'Planet does not exist')
    const planet = makePlanet({ mapServiceId, x, y, movementDifficulty, resource, neighborPlanets })
    const created = await planetDb.insert({
      id: planet.getId(),
      mapServiceId: planet.getMapServiceId(),
      movementDifficulty: planet.getMovementDifficulty(),
      resource: planet.getResource(),
      neighborPlanets: planet.getNeighborPlanets(),
    })

    return created
  }
}
