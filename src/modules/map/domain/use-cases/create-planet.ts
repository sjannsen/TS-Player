import makePlanet from '../model'
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
  resource: PlanetResource
  neighborPlanets?: NeighborPlanets
}

export default function makeCreatePlanet({ planetDb }: CreatePlanetDependencies) {
  return async function createPlanet({
    id,
    mapServiceId,
    x,
    y,
    movementDifficulty,
    resource,
    neighborPlanets,
  }: CreatePlanetProps) {
    const exist = await planetDb.findById({ mapServiceId })
    if (exist && exist.id) {
      await planetDb.updateNeighbors({ id: exist.id, neighborPlanets })
      return exist
    }

    const planet = makePlanet({ id, mapServiceId, x, y, movementDifficulty, resource, neighborPlanets })
    const created = await planetDb.insert({
      id: planet.getId(),
      mapServiceId: planet.getMapServiceId(),
      movementDifficulty: planet.getMovementDifficulty(),
      resource: planet.getResource(),
      neighborPlanets: planet.getNeighborPlanets(),
    })

    return { ...created }
  }
}
