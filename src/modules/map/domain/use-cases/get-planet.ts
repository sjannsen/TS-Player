import { PlanetData } from '../model/planet'
import { PlanetInvalidArgumentError } from '../model/planet.erros'
import { PlanetDb } from './data-access'

type GetPlanetDependencies = {
  planetDb: PlanetDb
}

type GetPlanetProps = {
  id?: string
  mapServiceId?: string
}

export default function makeGetPlanet({ planetDb }: GetPlanetDependencies) {
  return async function getPlanet(queryParams: GetPlanetProps): Promise<PlanetData | null> {
    if (!queryParams || Object.keys(queryParams).length === 0)
      throw new PlanetInvalidArgumentError(`Query params are undefined: ${queryParams}`)

    const { id, mapServiceId } = queryParams
    let planet = null
    if (id) planet = await planetDb.findById({ id })
    else if (mapServiceId) planet = await planetDb.findByMapServiceId({ mapServiceId })

    if (!id && !mapServiceId) throw new Error('No QuerryParams for getPlanet?!')
    return planet
  }
}
