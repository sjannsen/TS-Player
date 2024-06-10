import { Driver } from 'neo4j-driver-core'
import { Direction } from '../../../../../shared/types'
import logger from '../../../../../utils/logger'
import { getCurrentGameId } from '../../../../game'
import Id from '../../../domain/Id'
import { PlanetData } from '../../../domain/model/planet'

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
    updateNeighbors,
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
      MATCH (p:Planet {gameId: $gameId})-[c:CONNECTED_TO]->(n) 
      OPTIONAL MATCH (p)-[h:HAS_RESOURCE]->(r)
      WITH p, collect({direction: c.direction, mapServiceId: n.mapServiceId}) AS directions, h, r
      WITH p, 
          [d IN directions WHERE d.direction = 'NORTH' | d.mapServiceId] AS north,
          [d IN directions WHERE d.direction = 'EAST' | d.mapServiceId] AS east,
          [d IN directions WHERE d.direction = 'SOUTH' | d.mapServiceId] AS south,
          [d IN directions WHERE d.direction = 'WEST' | d.mapServiceId] AS west,
          h, r
      RETURN
        {
          id: p.id,
          mapServiceId: p.mapServiceId,
          x: p.x,
          y: p.y,
          neighborPlanets: {
            NORTH: north[0],
            EAST: east[0],
            SOUTH: south[0],
            WEST: west[0]
          },
          resource: {
            resourceType: r.type, 
            currentAmount: h.currentAmount,
            maxAmount: h.maxAmount
          }
        } AS planet`,
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

  async function findById({ id, mapServiceId }: { id?: string; mapServiceId?: string }): Promise<PlanetData | null> {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    const cypherQuery = `
      MATCH (p:Planet)-[c:CONNECTED_TO]->(n) 
      WHERE p.gameId = $gameId AND (p.id = $id OR p.mapServiceId = $mapServiceId)
      OPTIONAL MATCH (p)-[h:HAS_RESOURCE]->(r)
      WITH p, collect({direction: c.direction, mapServiceId: n.mapServiceId}) AS directions, h, r
      WITH p, 
          [d IN directions WHERE d.direction = 'NORTH' | d.mapServiceId] AS north,
          [d IN directions WHERE d.direction = 'EAST' | d.mapServiceId] AS east,
          [d IN directions WHERE d.direction = 'SOUTH' | d.mapServiceId] AS south,
          [d IN directions WHERE d.direction = 'WEST' | d.mapServiceId] AS west,
          h, r
      RETURN 
       {
          id: p.id,
          mapServiceId: p.mapServiceId,
          x: p.x,
          y: p.y,
          neighborPlanets: {
            NORTH: north[0],
            EAST: east[0],
            SOUTH: south[0],
            WEST: west[0]
          },
          resource: {
            resourceType: r.type, 
            currentAmount: h.currentAmount,
            maxAmount: h.maxAmount
          }
        } AS planet`

    try {
      const { records } = await session.run(cypherQuery, {
        id: id ?? null,
        mapServiceId: mapServiceId ?? null,
        gameId,
      })

      const result = records.map((record) => record.get('planet'))
      return result[0] ?? null
    } catch (error) {
      logger.error({ error, id, mapServiceId }, 'Error while query a planet by id from database')
      throw error
    } finally {
      await session.close()
    }
  }

  async function insert({
    id = Id.makeId(),
    mapServiceId,
    movementDifficulty,
    neighborPlanets,
    resource,
  }: Omit<PlanetData, 'x' | 'y'>): Promise<Partial<PlanetData | null>> {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    let cypherQuery = `
    MERGE (p:Planet {id: $id, mapServiceId: $mapServiceId})
    ON CREATE SET p.movementDifficulty = $movementDifficulty, p.gameId = $gameId
    `
    let cypherQueryReturnPart =
      'RETURN { id: p.id, mapServiceId: p.mapServiceId, movementDifficulty: p.movementDifficulty} AS planet'
    let cypherQueryParams: {
      id: string
      mapServiceId: string
      movementDifficulty: number
      resourceType?: string
      currentAmount?: number
      maxAmount?: number
      gameId: string
    } = {
      id,
      mapServiceId,
      movementDifficulty,
      gameId,
    }

    try {
      for (const [direction, mapServiceId] of Object.entries(neighborPlanets!)) {
        if (!mapServiceId) continue
        const directionShort = direction[0].toLowerCase()
        const oppositeDirection = getOppositeDirection(direction as Direction)
        const addition = `
        MERGE (p)-[:CONNECTED_TO {direction: '${direction}'}]->(${directionShort}:Planet {mapServiceId: '${mapServiceId}'})
        MERGE (${directionShort})-[:CONNECTED_TO {direction: '${oppositeDirection}'}]->(p)`
        cypherQuery += addition
        cypherQueryReturnPart += `, {${direction}: ${directionShort}.mapServiceId} AS ${direction}`
      }

      if (resource) {
        const addition = `
        MERGE (r:Resource {type: $resourceType})
        MERGE (p)-[h:HAS_RESOURCE {currentAmount: $currentAmount, maxAmount: $maxAmount}]->(r)
        `
        cypherQueryReturnPart += ', { type: r.type, currentAmount: h.currentAmount, maxAmount: h.maxAmount} AS resource'
        cypherQuery += addition
        const { resourceType, currentAmount, maxAmount } = resource
        cypherQueryParams = { ...cypherQueryParams, resourceType: resourceType, maxAmount, currentAmount }
      }

      cypherQuery += cypherQueryReturnPart
      const { records } = await session.run(cypherQuery, cypherQueryParams)

      const result = records.map((record) => {
        return {
          ...record.get('planet'),
          neighborPlanets: {
            NORTH: record.has('NORTH') ? record.get('NORTH')?.NORTH ?? null : null,
            EAST: record.has('EAST') ? record.get('EAST')?.EAST ?? null : null,
            SOUTH: record.has('SOUTH') ? record.get('SOUTH')?.SOUTH ?? null : null,
            WEST: record.has('WEST') ? record.get('WEST')?.WEST ?? null : null,
          },
          resource: record.has('resource') ? record.get('resource') : null,
        }
      })
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
          cypherQueryReturnPart,
          cypherQueryParams,
        },
        'Error while inserting a planets in database'
      )
      throw error
    } finally {
      await session.close()
    }
  }

  async function updateNeighbors({ id, neighborPlanets }: Partial<PlanetData>): Promise<Partial<PlanetData> | null> {
    const session = driver.session()
    const gameId = getCurrentGameId()

    if (!gameId) {
      logger.error('Cannot insert planet in db bevause currentGameId is undefined')
      throw new Error('GameId not found')
    }

    let cypherQuery = `
    MATCH (p:Planet {id: $id, gameId: $gameId})
    `
    let cypherQueryReturnPart = 'RETURN { id: p.id, mapServiceId: p.mapServiceId } AS planet'
    try {
      for (const [direction, mapServiceId] of Object.entries(neighborPlanets!)) {
        if (!mapServiceId) continue
        const directionShort = direction[0].toLowerCase()
        const oppositeDirection = getOppositeDirection(direction as Direction)
        const addition = `
        MERGE (p)-[:CONNECTED_TO {direction: '${direction}'}]->(${directionShort}:Planet {mapServiceId: '${mapServiceId}'})
        MERGE (${directionShort})-[:CONNECTED_TO {direction: '${oppositeDirection}'}]->(p)`
        cypherQuery += addition
        cypherQueryReturnPart += `, {${direction}: ${directionShort}.mapServiceId} AS ${direction}`
      }

      cypherQuery += cypherQueryReturnPart
      const { records } = await session.run(cypherQuery, { id, gameId })

      const result = records.map((record) => {
        return {
          ...record.get('planet'),
          neighborPlanets: {
            NORTH: record.has('NORTH') ? record.get('NORTH').NORTH : null,
            EAST: record.has('EAST') ? record.get('EAST').EAST : null,
            SOUTH: record.has('SOUTH') ? record.get('SOUTH').SOUTH : null,
            WEST: record.has('WEST') ? record.get('WEST').WEST : null,
          },
          resource: record.has('resource') ? record.get('resource') : null,
        }
      })
      return result[0] ?? null
    } catch (error) {
      logger.error({ error, id, neighborPlanets }, 'Error while updating neighbor of planet')
      throw error
    } finally {
      await session.close()
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
}
