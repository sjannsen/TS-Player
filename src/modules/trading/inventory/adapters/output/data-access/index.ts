import { getMongoDBConnection } from '../../../../../../db/mongoDB-connection'
import makeMakeInventoriesDatabase from './inventories-database'

const inventorieDb = makeMakeInventoriesDatabase({ makeDb: getMongoDBConnection })
export default inventorieDb
