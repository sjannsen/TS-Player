import { PlanetNotFoundError } from '../model/planet.erros'
import { PlanetDb } from './types'

type MineResourceDependencies = {
  planetDb: PlanetDb
}

type MineResourceProps = {
  id: string
  amount: number
}

export default function makeMineResource({ planetDb }: MineResourceDependencies) {
  return function mineResource({ id, amount }: MineResourceProps) {
    const planet = planetDb.find({ id })

    if (!planet) throw new PlanetNotFoundError(`Planet with Id: ${id} does not exist`)

    planet.mineResource(amount)
    planetDb.update(planet)
  }
}
