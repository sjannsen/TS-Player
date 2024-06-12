import { Driver } from 'neo4j-driver-core'
import { Direction } from '../../../../../shared/types'
import logger from '../../../../../utils/logger'
import { getCurrentGameId } from '../../../../game'
import Id from '../../../domain/Id'
import { NeighborPlanets, PlanetData } from '../../../domain/model/planet'

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
    findById,
    findAll,
    insert,
    addResource,
    addCoordinates,
    updateResourceAmount,
    findShortestPath,
    updatePlanet,
    addRelationship,
    existPlanetWithMapServiceId,
    findPlanetByMapServiceId,
    findExistingRelations,
  })

  async function findAll(): Promise<PlanetData[]> {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error({ gameId }, 'Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    try {
      const { records } = await session.run(
        `
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
      } as planet`,
        { gameId }
      )

      const results = records.map((record) => record.get('planet'))

      return results ?? []
    } catch (error) {
      logger.error({ error, gameId }, 'Error while query all planets from database')
      throw error
    } finally {
      await session.close()
    }
  }

  async function findPlanetByMapServiceId({ mapServiceId }: { mapServiceId: string }): Promise<PlanetData | null> {
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
    logger.info({ mapServiceId }, 'FindPlanetByMapId')
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

  async function existPlanetWithMapServiceId({ mapServiceId }: { mapServiceId: string }) {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    try {
      const { records } = await session.run(
        `MATCH (p:Planet {mapServiceId: $mapServiceId, gameId: $gameId}) RETURN p`,
        { mapServiceId, gameId }
      )
      logger.info({ records }, 'Records')
      if (records.length > 0) return true
      return false
    } catch (error) {
      logger.error({ mapServiceId }, 'Error while check existing')
      throw error
    }
  }

  async function findById({ id }: { id?: string }): Promise<PlanetData | null> {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }
    logger.warn({ id }, 'find by id')
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
            NORTH: p.r_north,
            EAST: p.r_east,
            SOUTH: p.r_south,
            WEST: p.r_west
          },
          resource: {
            resourceType: r.type, 
            currentAmount: h.currentAmount,
            maxAmount: h.maxAmount
          }


    } as planet`

    try {
      const { records } = await session.run(cypherQuery, {
        id: id ?? null,
        gameId,
      })

      const result = records.map((record) => record.get('planet'))
      logger.info({ result: result[0] }, 'Query result')
      console.log(result[0] ?? null)
      console.log(result[0])
      console.log(null)

      return result[0] ?? null
    } catch (error) {
      logger.error({ error, id }, 'Error while query a planet by id from database')
      throw error
    } finally {
      await session.close()
    }
  }

  async function insert({
    id,
    mapServiceId,
    movementDifficulty,
    neighborPlanets,
    resource,
  }: Omit<PlanetData, 'x' | 'y'>): Promise<Partial<PlanetData | null>> {
    logger.info({ id, mapServiceId }, 'Insert')
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    const cypherQuery = `
    MERGE (p:Planet {id: $id})
    ON CREATE SET p.mapServiceId = $mapServiceId, p.gameId = $gameId
    RETURN {
      id: p.id,
      mapServiceId: p.mapServiceId, 
      gameId: p.gameId
    } AS planet
    `
    try {
      const { records } = await session.run(cypherQuery, { id, mapServiceId, gameId })

      const result = records.map((record) => {
        return record.has('planet') ? record.get('planet') : null
      })

      logger.info({ result }, 'Inserted planet')

      return result[0]
    } catch (error) {
      logger.error(
        {
          error,
          id,
          mapServiceId,
          movementDifficulty,
          neighborPlanets,
          resource,
          cypherQuery,
        },
        'Error while inserting a planets in database'
      )
      throw error
    } finally {
      await session.close()
    }
  }

  async function findExistingRelations({ id }: { id: string }): Promise<NeighborPlanets | null> {
    logger.info('find existing relations')
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    const cypherQuery = `
    MATCH (p:Planet {id: $id, gameId: $gameId})
    OPTIONAL MATCH (p)-[north:NORTH]-(n)
    OPTIONAL MATCH (p)-[east:EAST]-(e)
    OPTIONAL MATCH (p)-[south:SOUTH]-(s)
    OPTIONAL MATCH (p)-[west:WEST]-(w)
    RETURN {
    north: n.mapId,
    east: e.mapId,
    south: s.mapId,
    west: w.mapId
    } as neighborPlanets
    `

    try {
      const { records } = await session.run(cypherQuery, { id, gameId })

      const results = records.map((record) => (record.has('neighborPlanets') ? record.get('neighborPlanets') : null))
      logger.info({ results })
      return results[0]
    } catch (error) {
      logger.error({ id }, 'Error while findExistingRelationships')
      throw error
    }
  }

  async function addCoordinates({ id, x: x1, y: y1 }: Partial<PlanetData>): Promise<Partial<PlanetData> | null> {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    const x = x1 ? x1 : null
    const y = y1 ? y1 : null

    const cypherQuery = `
    MATCH (p:Planet)
    WHERE p.id = $id AND p.gameId = $gameId
    SET p.x = $x, p.y = $y
    RETURN p AS planet
    `
    try {
      const { records } = await session.run(cypherQuery, { id, x, y, gameId })
      records.forEach((record) => {
        console.log('Planet has the following props:', record.keys)
      })
      const result = records.map((record) => {
        return {
          ...record.get('planet').properties,
        }
      })
      return result[0] ?? null
    } catch (error) {
      logger.error({ error, id, x, y, gameId }, 'Error while adding coordinates to planet')
      throw error
    } finally {
      await session.close()
    }
  }

  async function addResource({ id, resource }: Partial<PlanetData>) {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    const cypherQuery = `
    MATCH (p:Planet)
    WHERE p.id = $id AND p.gameId = $gameId
    MERGE (r:Resource {type: $type})
    MERGE (p)-[h:HAS_RESOURCE {currentAmount: $currentAmount, maxAmount: $maxAmount}]->(r)
    RETURN p AS planet, { type: r.type, currentAmount: h.currentAmount, maxAmount: h.maxAmount} AS resource
    `
    try {
      const { records } = await session.run(cypherQuery, { id, ...resource, gameId })
      records.forEach((record) => {
        console.log('Planet has the following props:', record.keys)
      })

      const result = records.map((record) => {
        return {
          ...record.get('planet').properties,
          resource: record.get('resource') ? record.get('resource') : null,
        }
      })

      return result[0] ?? null
    } catch (error) {
      logger.error({ error, id, resource, gameId }, 'Error while adding resource to planet')
      throw error
    } finally {
      await session.close()
    }
  }

  async function updateResourceAmount({ id, resource }: Partial<PlanetData>) {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    const cypherQuery = `
    MATCH (p:Planet)-[h:HAS_RESOURCE]->(r)
    WHERE p.id = $id AND p.gameId = $gameId
    SET h.currentAmount = $currentAmount
    RETURN p AS planet, { type: r.type, currentAmount: h.currentAmount, maxAmount: h.maxAmount} AS resource
    `

    if (!resource) {
      logger.error({ id, resource }, 'Cannot update resource amount, resource is undefined')
      throw new Error('resource undefined')
    }

    const { currentAmount } = resource
    try {
      const { records } = await session.run(cypherQuery, { id, currentAmount, gameId })
      const result = records.map((record) => {
        return {
          ...record.get('planet').properties,
          resource: record.get('resource') ? record.get('resource') : null,
        }
      })
      return result[0] ?? null
    } catch (error) {
      logger.error({ error, id, resource, gameId }, 'Error while updating resource amount')
      throw error
    } finally {
      await session.close()
    }
  }

  interface PlanetRecord {
    id: string
  }

  interface Relationship {
    type: string
  }

  interface PathSegment {
    start: PlanetRecord
    relationship: Relationship
    end: PlanetRecord
  }

  interface Path {
    segments: PathSegment[]
  }

  async function findShortestPath({
    currentId,
    targetId,
  }: {
    currentId: string
    targetId: string
  }): Promise<unknown | null> {
    const session = driver.session()
    const cypherQuery = `
    MATCH (current:Planet { id: $currentId})
    MATCH (target:Planet {id: $targetId})
    MATCH path = shortestPath((current)-[*..20]-(target))
    RETURN path
    `
    try {
      const { records } = await session.run(cypherQuery, { currentId, targetId })

      if (records.length === 0) {
        logger.warn({ currentId, targetId }, 'No shortest path found between')
        return null
      }

      const result = records.forEach((record) => {
        return { record: record.has('path') ? record.get('path') : null }
      })
      logger.error({ result }, 'SHORTEST PATH')
      logger.error({ records }, 'SHORTEST PATH')

      return new Promise((resolve) => resolve(null))
    } catch (error) {
      logger.error({ currentId, targetId }, 'Error while finding the shortest path')
      throw error
    } finally {
      await session.close()
    }
  }

  async function updatePlanet({
    id,
    mapServiceId,
    movementDifficulty,
    x,
    y,
    neighborPlanets,
  }: Partial<PlanetData>): Promise<PlanetData | null> {
    logger.info({ id, mapServiceId, neighborPlanets }, 'update')
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot update planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    let cypherQuery = `
    MATCH (p:Planet {id: $id, gameId: $gameId})
    `

    if (!neighborPlanets) throw Error(`Neighbor planets are missing, cannot update neighbors of ${id}`)
    for (const [direction, mapServiceId] of Object.entries(neighborPlanets)) {
      if (!mapServiceId) continue
      const short = direction[0].toLowerCase()
      const opposite = getOppositeDirection(direction as Direction)
      cypherQuery += `
      WITH *
      OPTIONAL MATCH (${short}: Planet {mapServiceId: '${mapServiceId}'})
      FOREACH (ignored IN CASE WHEN ${short} IS NULL THEN [1] ELSE [] END |
      CREATE (${short}:Planet {mapServiceId: '${mapServiceId}', id: '${Id.makeId()}'})
      )
      WITH *
      MERGE (p)-[:${direction}]->(${short})
      MERGE (${short})-[:${opposite}]->(p)`
    }

    try {
      const { records } = await session.run(cypherQuery, { id, movementDifficulty, x, y, gameId })

      const result = records[0]?.has('planet') ? records[0].get('planet') : null
      logger.info({ result }, `Updated planet :${id}, ${mapServiceId}`)
      return result
    } catch (error) {
      logger.error({ error }, 'Error while updating Planet')
      throw error
    } finally {
      await session.close()
    }
  }

  async function addRelationship({
    firstPlanet,
    secondPlanet,
    direction,
  }: {
    firstPlanet: string
    secondPlanet: string
    direction: Direction
  }) {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    const cypherQuery = `
        MATCH (p1 {id: $firstPlanet, gameId: $gameId})
        MATCH (p2 {id: $secondPlanet, gameId: $gameId})
        MERGE (p1)-[:${direction}]->(p2)
        MERGE (p2)-[:${getOppositeDirection(direction)}]->(p1)`
    try {
      await session.run(cypherQuery, { firstPlanet, secondPlanet, direction, gameId })
    } catch (error) {
      logger.error({ firstPlanet, secondPlanet, direction, gameId }, 'Error while adding relation')
      throw error
    }
  }
}
