import makePlanet from '../model'
import { NeighborPlanets, PlanetResource } from '../model/planet'
import { PlanetDb } from './types'

type CreatePlanetDependencies = {
  planetDb: PlanetDb
}

type CreatePlanetProps = {
  id?: string
  mapServiceId: string
  x: number
  y: number
  movementDifficulty: number
  resource: PlanetResource
  neighborPlanets?: NeighborPlanets
}

export default function makeCreatePlanet({ planetDb }: CreatePlanetDependencies) {
  return function createPlanet({
    id,
    mapServiceId,
    x,
    y,
    movementDifficulty,
    resource,
    neighborPlanets,
  }: CreatePlanetProps) {
    const exist = planetDb.find({ mapServiceId })
    if (exist) return exist

    const planet = makePlanet({ id, mapServiceId, x, y, movementDifficulty, resource, neighborPlanets })
    planetDb.insert(planet)

    return planet
  }
}
