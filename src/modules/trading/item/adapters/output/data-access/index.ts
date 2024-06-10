import { connectToMongoDB } from '../../../../../../db/mongoDB-connection'
import { ItemsDatabase } from '../../../domain/use-cases/data-access'
import makeItemsDatabase from './items-database'

const itemsDatabase: ItemsDatabase = makeItemsDatabase({ makeDb: connectToMongoDB })

export default itemsDatabase
