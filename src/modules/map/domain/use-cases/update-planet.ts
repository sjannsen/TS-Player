import logger from '../../../../utils/logger'
import makePlanet from '../model'
import { NeighborPlanets, PlanetResource } from '../model/planet'
import { PlanetDb } from './data-access'

type MakeUpdatePlanetDependencies = {
  planetDb: PlanetDb
}

type MakeUpdatePlanetProps = {
  id?: string
  mapServiceId: string
  x?: number
  y?: number
  movementDifficulty: number
  resource?: PlanetResource | null | undefined
  neighborPlanets?: NeighborPlanets
}

export default function makeMakeUpdatePlanet({ planetDb }: MakeUpdatePlanetDependencies) {
  return async function updatePlanet({
    id,
    mapServiceId,
    x,
    y,
    movementDifficulty,
    resource,
    neighborPlanets,
  }: MakeUpdatePlanetProps) {
    logger.info({ id, mapServiceId, neighborPlanets }, 'Update planet')
    if (!id) throw new Error('Id is undefined')

    const existing = await planetDb.findById({ id })
    if (!existing) throw new Error(`Planet with Id ${id} does not exist. Cannot update planet`)

    const planet = makePlanet({ ...existing, x, y, movementDifficulty, resource, neighborPlanets })

    const updated = await planetDb.update({
      id: planet.getId(),
      movementDifficulty: planet.getMovementDifficulty(),
      x: planet.getCoordinates().x,
      y: planet.getCoordinates().y,
      neighborPlanets: planet.getNeighborPlanets(),
      resource: planet.getResource(),
    })

    return { ...existing, ...updated }
  }
}
