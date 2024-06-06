import { connectToMongoDB } from '../../../../../db/mongoDB-connection'
import makeRobotsDatabase from './robots-database'

const robotsDb = makeRobotsDatabase({ makeDb: connectToMongoDB })
export default robotsDb
