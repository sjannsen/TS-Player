import { Planet } from '../../domain/model/planet'
import { PlanetDb } from '../../domain/use-cases/types'

const planetDb: PlanetDb = {
  find: () => ({}) as Planet,
  findAll: () => [],
  insert: () => ({}) as Planet,
  update: () => ({}) as Planet,
}

export default planetDb
