import { connectToMongoDB } from '../../../../../db/connection'
import makeRobotsDatabase from './robots-database'

const robotsDb = makeRobotsDatabase({ makeDb: connectToMongoDB })
export default robotsDb
