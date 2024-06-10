import makePlanet from '../model'
import { PlanetNotFoundError } from '../model/planet.erros'
import { PlanetDb } from './data-access'

type MineResourceDependencies = {
  planetDb: PlanetDb
}

type MineResourceProps = {
  mapServiceId: string
  amount: number
}

const mineResourceErrorMessage = 'Error while mining resource of planet'
export default function makeMineResource({ planetDb }: MineResourceDependencies) {
  return async function mineResource({ mapServiceId, amount }: MineResourceProps) {
    const existing = await planetDb.findById({ mapServiceId })
    const planetNotExistingError = `${mineResourceErrorMessage}: Planet with Id: ${mapServiceId} does not exist`
    if (!existing) throw new PlanetNotFoundError(planetNotExistingError)

    const planet = makePlanet({ ...existing })
    planet.mineResource(amount)

    const updated = await planetDb.updateResourceAmount({
      id: planet.getId(),
      resource: planet.getResource(),
    })

    return { ...existing, ...updated }
  }
}
