import { PlanetData } from '../model/planet'
import { PlanetDb } from './data-access'

type GetPlanetsDependencies = {
  planetDb: PlanetDb
}

export default function makeGetPlanets({ planetDb }: GetPlanetsDependencies) {
  return async function getPlanets(): Promise<PlanetData[]> {
    const planets: PlanetData[] = await planetDb.findAll()
    return planets
  }
}
