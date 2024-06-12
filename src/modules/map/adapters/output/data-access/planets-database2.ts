import { Driver } from 'neo4j-driver-core'
import { Direction } from '../../../../../shared/types'
import logger from '../../../../../utils/logger'
import { getCurrentGameId } from '../../../../game'
import { NeighborPlanets, PlanetData, PlanetResource } from '../../../domain/model/planet'
import Id from '../../../domain/Id'

function getOppositeDirection(direction: Direction) {
  switch (direction) {
    case 'NORTH':
      return 'SOUTH'
    case 'EAST':
      return 'WEST'
    case 'SOUTH':
      return 'NORTH'
    case 'WEST':
      return 'EAST'
    default:
      throw new Error(`Direction is invalid: ${direction}`)
  }
}

export default function makePlanetsDatabase(driver: Driver) {
  return Object.freeze({
    insert,
    findByMapServiceId,
    findAll,
    findById,
    update,
  })

  async function insert({
    id,
    mapServiceId,
    movementDifficulty,
    neighborPlanets,
    resource,
  }: PlanetData): Promise<PlanetData> {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!id) throw new Error('Id is undefined, cannot insert planet in database')
    if (!gameId) throw new Error('Cannot insert planet in database because the gameId is undefined')

    const cypherQuery = `
    MERGE (p: Planet {id: $id})
    ON CREATE SET  
        p.gameId = $gameId, 
        p.mapServiceId = $mapServiceId, 
        p.movementDifficulty = $movementDifficulty
    RETURN {
        id: p.id,
        mapServiceId: p.mapServiceId, 
        movementDifficulty: p.movementDifficulty
    } AS planet
    `

    try {
      const { records } = await session.run(cypherQuery, { id, gameId, mapServiceId, movementDifficulty })
      const results = records.map((record) => (record.has('planet') ? record.get('planet') : undefined))
      let planet = results[0]

      if (neighborPlanets) {
        const planetNeighbors = await insertNeighbors({ id, neighbors: neighborPlanets })
        planet = { ...planet, neighborPlanets: planetNeighbors }
      }
      if (resource) {
        const planetResource = await insertResource({ id, resource })
        planet = { ...planet, resource: planetResource }
      }

      logger.info({ results }, 'Inserted planet')
      return planet
    } catch (error) {
      logger.error(
        { error, id, mapServiceId, movementDifficulty, neighborPlanets, resource },
        'An error ocurred while inserting a planet in the database'
      )
      throw error
    } finally {
      await session.close()
    }
  }

  async function insertNeighbors({ id, neighbors }: { id: string; neighbors: NeighborPlanets }) {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) throw new Error('Cannot insert planet in database because the gameId is undefined')

    let cypherQuery = `
    MATCH (p: Planet {id: $id, gameId: $gameId})`
    let cypherQueryReturn = `RETURN {`

    const validEntriesCount = Object.values(neighbors).filter((mapServiceId) => mapServiceId).length
    let validEntriesProcessed = 0

    for (const [direction, mapServiceId] of Object.entries(neighbors)) {
      if (!mapServiceId) continue
      const short = direction[0].toLowerCase()
      const oppositeDirection = getOppositeDirection(direction as Direction)

      const cypherQueryAddition = `
      MERGE (${short}: Planet {mapServiceId: '${mapServiceId}', gameId: $gameId, id: '${Id.makeId()}'})
      MERGE (p)-[:${direction}]->(${short}) 
      MERGE (${short})-[:${oppositeDirection}]->(p)`

      validEntriesProcessed++
      const shouldAddComma = validEntriesProcessed < validEntriesCount
      const cypherQueryReturnAddition = `${direction}: ${short}.mapServiceId ${shouldAddComma ? ',' : ''}`

      cypherQuery += cypherQueryAddition
      cypherQueryReturn += cypherQueryReturnAddition
    }

    cypherQueryReturn += `} AS neighborPlanets`
    cypherQuery += cypherQueryReturn

    try {
      const { records } = await session.run(cypherQuery, { id, gameId })
      const results = records.map((record) => (record.has('planet') ? record.get('planet') : undefined))

      logger.info({ results }, 'Inserted planet')
      return results[0]
    } catch (error) {
      logger.error({ error }, 'An error ocurred while inserting a neighbor in the database')
      throw error
    } finally {
      await session.close()
    }
  }

  async function insertResource({ id, resource }: { id: string; resource: PlanetResource }) {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!id) throw new Error('Id is undefined, cannot insert planet in database')
    if (!gameId) throw new Error('Cannot insert planet in database because the gameId is undefined')

    const cypherQuery = `
    Match (p: Planet {id: $id, gameId: $gameId})
    MERGE (p)-[h:HAS_RESOURCE {currentAmount: $currentAmount, maxAmount: $maxAmount}]->(r:Resource {type: $type})
    RETURN {
        currentAmount: h.currentAmount, 
        maxAmount: h.maxAmount,
        type: r.type
    } AS resource`

    try {
      const { resourceType, currentAmount, maxAmount } = resource
      const { records } = await session.run(cypherQuery, { id, gameId, type: resourceType, currentAmount, maxAmount })
      const results = records.map((record) => (record.has('resource') ? record.get('resource') : undefined))

      logger.info({ results }, 'Inserted resource')
      return results[0]
    } catch (error) {
      logger.error({ error }, 'An error ocurred while inserting a planet in the database')
      throw error
    } finally {
      await session.close()
    }
  }

  async function findByMapServiceId({ mapServiceId }: { mapServiceId: string }) {
    logger.info({ mapServiceId }, 'FindPlanetByMapServiceId')
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    const cypherQuery = `
    MATCH (p:Planet {mapServiceId: $mapServiceId, gameId: $gameId})
    OPTIONAL MATCH (p)-[r_north: NORTH]->(north)
    OPTIONAL MATCH (p)-[r_east: EAST]->(east)
    OPTIONAL MATCH (p)-[r_south: SOUTH]->(south)
    OPTIONAL MATCH (p)-[r_west: WEST]->(west)
    OPTIONAL MATCH (p)-[h:HAS_RESOURCE]->(r)
      RETURN 
       {
          id: p.id,
          mapServiceId: p.mapServiceId,
          x: p.x,
          y: p.y,
          neighborPlanets: {
            NORTH: north.mapServiceId,
            EAST: east.mapServiceId,
            SOUTH: south.mapServiceId,
            WEST: west.mapServiceId
          },
          resource: {
            resourceType: r.type, 
            currentAmount: h.currentAmount,
            maxAmount: h.maxAmount
          }

    } as planet
    `
    try {
      const { records } = await session.run(cypherQuery, { mapServiceId, gameId })
      if (records.length == 0) return null
      const result = records[0].has('planet') ? records[0].get('planet') : null

      logger.info({ result }, `Result of query for ${mapServiceId}`)
      return result
    } catch (error) {
      logger.error({ mapServiceId }, 'Error while finding Planet by mapId')
      throw error
    }
  }

  async function findAll(): Promise<PlanetData[]> {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    const cypherQuery = `
    MATCH (p:Planet {gameId: $gameId})
    OPTIONAL MATCH (p)-[r_north: NORTH]->(north)
    OPTIONAL MATCH (p)-[r_east: EAST]->(east)
    OPTIONAL MATCH (p)-[r_south: SOUTH]->(south)
    OPTIONAL MATCH (p)-[r_west: WEST]->(west)
    OPTIONAL MATCH (p)-[h:HAS_RESOURCE]->(r)
      RETURN 
       {
          id: p.id,
          mapServiceId: p.mapServiceId,
          x: p.x,
          y: p.y,
          neighborPlanets: {
            NORTH: north.mapServiceId,
            EAST: east.mapServiceId,
            SOUTH: south.mapServiceId,
            WEST: west.mapServiceId
          },
          resource: {
            resourceType: r.type, 
            currentAmount: h.currentAmount,
            maxAmount: h.maxAmount
          }

    } as planet
    `
    try {
      const { records } = await session.run(cypherQuery, { gameId })
      if (records.length == 0) return []
      const result = records.map((record) => (record.has('planet') ? record.get('planet') : null))

      logger.info({ result }, `Result of query for all`)
      return result
    } catch (error) {
      logger.error({ error }, 'An error ocurred while findAll')
      throw error
    } finally {
      await session.close()
    }
  }

  async function findById({ id }: { id: string }): Promise<PlanetData | null> {
    logger.info({ id }, 'FindById')
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    const cypherQuery = `
    MATCH (p:Planet {id: $id, gameId: $gameId})
    OPTIONAL MATCH (p)-[r_north: NORTH]->(north)
    OPTIONAL MATCH (p)-[r_east: EAST]->(east)
    OPTIONAL MATCH (p)-[r_south: SOUTH]->(south)
    OPTIONAL MATCH (p)-[r_west: WEST]->(west)
    OPTIONAL MATCH (p)-[h:HAS_RESOURCE]->(r)
      RETURN 
       {
          id: p.id,
          mapServiceId: p.mapServiceId,
          x: p.x,
          y: p.y,
          neighborPlanets: {
            NORTH: north.mapServiceId,
            EAST: east.mapServiceId,
            SOUTH: south.mapServiceId,
            WEST: west.mapServiceId
          },
          resource: {
            resourceType: r.type, 
            currentAmount: h.currentAmount,
            maxAmount: h.maxAmount
          }

    } as planet
    `
    try {
      const { records } = await session.run(cypherQuery, { id, gameId })
      if (records.length == 0) return null
      const result = records[0].has('planet') ? records[0].get('planet') : null

      logger.info({ result }, `Result of query for ${id}`)
      return result
    } catch (error) {
      logger.error({ error, id }, 'An error ocurred while findById')
      throw error
    } finally {
      await session.close()
    }
  }

  async function update({
    id,
    mapServiceId,
    movementDifficulty,
    resource,
    x,
    y,
    neighborPlanets,
  }: Partial<PlanetData> & { id: string }): Promise<PlanetData | null> {
    logger.info({ id }, 'Update')
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    if (resource) {
      const cypherQuery = `
      MATCH (p:Planet {id: $id})
      MERGE (p)-[h:HAS_RESOURCE]->(r:Resource {type: $resourceType})
      ON CREATE SET h.currentAmount = $currentAmount, h.maxAmount = $maxAmount
      ON MATCH SET h.currentAmount = $currentAmount`

      try {
        const { resourceType, currentAmount, maxAmount } = resource
        const { records } = await session.run(cypherQuery, { id, resourceType, currentAmount, maxAmount })
        logger.info({ records }, 'Updated Resource')
      } catch (error) {
        logger.error({ error, id, resource }, 'Error while updating resource')
        throw error
      }
    }

    let cypherQuery = `MATCH (p:Planet {id: $id})`
    cypherQuery += 'SET '
    if (x) cypherQuery += `p.x = $x ${y || movementDifficulty ? ',' : ''}`
    if (y) cypherQuery += `p.y = $y ${movementDifficulty ? ',' : ''}`
    if (movementDifficulty) cypherQuery += `p.movementDifficulty = $movementDifficulty ${resource ? ',' : ''}`

    if (neighborPlanets) await insertNeighbors({ id, neighbors: neighborPlanets })

    const returnStatement = `
RETURN {
  id: p.id,
  mapServiceId: p.mapServiceId,
  x: p.x,
  y: p.y,
  movementDifficulty: p.movementDifficulty
} 
          `

    cypherQuery += returnStatement
    try {
      logger.info({ cypherQuery }, 'Query')
      const { records } = await session.run(cypherQuery, {
        id,
        gameId,
        x,
        y,
        movementDifficulty,
      })

      if (records.length == 0) return null
      const result = records[0].has('planet') ? records[0].get('planet') : null

      logger.info({ result }, `Updated planet`)
      return result
    } catch (error) {
      logger.error(
        { error, id, mapServiceId, movementDifficulty, x, y, resource, neighborPlanets },
        'An error ocurred while update'
      )
      throw error
    } finally {
      await session.close()
    }
  }
}
