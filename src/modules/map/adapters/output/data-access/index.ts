import { driver } from '../../../../../db/neo4j-connection'
import { PlanetDb } from '../../../domain/use-cases/data-access'
import makePlanetsDatabase from './planets-database2'

const planetDb: PlanetDb = makePlanetsDatabase(driver)

export default planetDb
