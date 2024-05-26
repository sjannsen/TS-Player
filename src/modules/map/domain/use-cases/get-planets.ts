import { Planet } from '../model/planet'
import { PlanetDb } from './types'

type GetPlanetsDependencies = {
  planetDb: PlanetDb
}

export default function makeGetPlanets({ planetDb }: GetPlanetsDependencies) {
  return function getPlanets() {
    const planets: Planet[] = planetDb.findAll()
    return planets
  }
}
