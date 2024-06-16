import { getMongoDBConnection } from '../../../../../db/mongoDB-connection'
import makeRobotsDatabase from './robots-database'

const robotsDb = makeRobotsDatabase({ makeDb: getMongoDBConnection })
export default robotsDb
