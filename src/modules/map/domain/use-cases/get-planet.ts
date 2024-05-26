import { PlanetInvalidArgumentError } from '../model/planet.erros'
import { PlanetDb } from './types'

type GetPlanetDependencies = {
  planetDb: PlanetDb
}

type GetPlanetProps = {
  id?: string
  mapServiceId?: string
  resource?: ResourceType
}

export default function makeGetPlanet({ planetDb }: GetPlanetDependencies) {
  return function getPlanet(queryParams: GetPlanetProps) {
    if (!queryParams || Object.keys(queryParams).length === 0)
      throw new PlanetInvalidArgumentError(`Query params must not be undefined: ${queryParams}`)
    const planet = planetDb.find(queryParams)
    return planet
  }
}
