import dotenv from 'dotenv'
import neo4j, { auth } from 'neo4j-driver'
import logger from '../utils/logger'

dotenv.config()

const URI = process.env.NEO4j_URI || 'bolt://localhost:7687'
const USERNAME = process.env.NEO4j_USERNAME || 'neo4j'
const PASSWORD = process.env.NEO4j_PASSWORD || 'letmein!'

const driver = neo4j.driver(URI, auth.basic(USERNAME, PASSWORD))

async function connectToNeo4j() {
  const session = driver.session()
  try {
    await session.run('RETURN 1')
    const serverInfo = await driver.getServerInfo()
    logger.info({ serverInfo }, 'Sucessfully connected to Neo4j: ')
  } catch (error) {
    logger.error({ error }, 'Error while connecting to Neo4j: ')
    throw error
  } finally {
    await session.close()
  }
}

async function closeConnectionToNeo4j() {
  await driver.close()
}

export { closeConnectionToNeo4j, connectToNeo4j, driver }
