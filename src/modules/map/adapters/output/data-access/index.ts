import { PlanetDb } from '../../../domain/use-cases/data-access'
import makeInMemoryDatabase from './in-memory-planets-database'

const planetDb: PlanetDb = makeInMemoryDatabase()

export default planetDb
