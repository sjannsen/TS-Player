import { connectToMongoDB } from '../../../../../../db/mongoDB-connection'
import makeMakeInventoriesDatabase from './inventories-database'

const inventorieDb = makeMakeInventoriesDatabase({ makeDb: connectToMongoDB })
export default inventorieDb
