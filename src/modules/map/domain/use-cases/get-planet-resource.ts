import { PlanetResource } from '../model/planet'
import { PlanetDb } from './data-access'

type GetPlanetResourceDependencies = {
  planetDb: PlanetDb
}

type GetPlanetResourceProps = {
  planetId: string
}

export default function makeGetPlanetResource({ planetDb }: GetPlanetResourceDependencies) {
  return async function getPlanetResources({ planetId }: GetPlanetResourceProps): Promise<PlanetResource | undefined> {
    const planet = await planetDb.findByMapServiceId({ mapServiceId: planetId })

    if (!planet || !planet.resource) return undefined

    return { ...planet.resource }
  }
}
