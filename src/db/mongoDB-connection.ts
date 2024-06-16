import { Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import logger from '../utils/logger'
import { MongoDBError } from './mongoDB.errors'

dotenv.config()

const url = process.env.MONGO_DB_URI
const dbName = process.env.MONGO_DB_NAME

if (!url) {
  logger.error('MongoDB URL is undefined')
  throw new MongoDBError('MongoDB URL is undefined')
}

if (!dbName) {
  logger.error('MongoDB database name is undefined')
  throw new MongoDBError('MongoDB database name is undefined')
}

const client = new MongoClient(url)
let db: Db

async function initializeMongoDBConnection() {
  if (db) return db
  try {
    await client.connect()
    console.log(`Connected to MongoDB at ${url} and created database ${dbName}`)
    db = client.db(dbName)
    return db
  } catch (error) {
    logger.error({ error }, `Failed to connect to MongoDB: ${dbName}:${url}`)
    throw error
  }
}

async function getMongoDBConnection() {
  if (db) return db
  return await initializeMongoDBConnection()
}

async function closeConnectionToMongoDB() {
  try {
    if (client) {
      await client.close()
      console.log('Disconnected from MongoDB')
    }
  } catch (error) {
    logger.error({ error }, `Failed to disconnect from MongoDB: ${dbName}:${url}`)
    throw error
  }
}

export { initializeMongoDBConnection, getMongoDBConnection, closeConnectionToMongoDB }
