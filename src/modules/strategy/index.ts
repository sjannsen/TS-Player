import eventBus from '../../event-handling/event-bus'
import { EventContext } from '../../event-handling/events'
import logger from '../../utils/logger'
import { closeConnectionToNeo4j } from '../../db/neo4j-connection'
import { PlanetData } from '../map/domain/model/planet'
import { getPlanet, getPlanets } from '../map/domain/use-cases'
import { moveRobot } from '../robot/adapters/output/commands'
import { buyRobots } from '../robot/adapters/output/commands/buyRobots'
import { listRobots } from '../robot/domain/use-cases'
import { mine } from './mine'
import planetDb from '../map/adapters/output/data-access'

const setUpStrategyStateHandlers = () => {
  eventBus.subscribe('RoundStatus', async ({ event }: EventContext<'RoundStatus'>) => {
    if (event.payload.roundStatus == 'started' && event.payload.roundNumber === 2) {
      try {
        await buyRobots(5)
      } catch (error) {
        logger.error(error, 'An error ocurred while buying robots')
      }
      logger.info('Bought Robots')
    }

    // if (event.payload.roundStatus == 'started' && event.payload.roundNumber > 4 && event.payload.roundNumber < 10) {
    //   logger.info('Mine')
    //   mine()
    // }
  })

  eventBus.subscribe('RoundStatus', async ({ event }: EventContext<'RoundStatus'>) => {
    if (event.payload.roundStatus !== 'started') return

    if (event.payload.roundNumber < 2) return

    const robots = await listRobots()
    if (robots.length == 0) {
      logger.error('No robots to move')
      return
    }

    // const robot = robots[1]
    // const planet = await getPlanet({ mapServiceId: robot.currentPlanet })

    // if (!planet) {
    //   logger.error({ planet }, 'Error while move robot: Planet of robot does not exist?!')
    //   return
    // }

    // const neighbor = getFirstNeighbor(planet)
    // if (!neighbor) {
    //   logger.error({ neighborPlanet: neighbor }, 'Error while getting neighbor planet to move to')
    //   return
    // }

    // const planetToMove = neighbor.value
    // logger.info({ robot: robot.robotServiceId, planet2Move2: planetToMove }, 'Move robot to planet')
    // moveRobot({ robotId: robot.robotServiceId, planetId: planetToMove })

    robots.forEach(async (robot) => {
      if (robot.attributes.energy <= 3) return
      const planet = await getPlanet({ mapServiceId: robot.currentPlanet })
      if (!planet) {
        logger.error({ planet }, 'Error while move robot: Planet of robot does not exist?!')
        return
      }

      const neighbor = getFirstNeighbor(planet)
      if (!neighbor) {
        logger.error(
          { neighborPlanet: neighbor, robotPlanet: robot.currentPlanet },
          'Error while getting neighbor planet to move to'
        )
        return
      }

      const planetToMove = neighbor.value

      logger.info({ robot: robot.robotServiceId, planet2Move2: planetToMove }, 'Move robot to planet')
      moveRobot({ robotId: robot.robotServiceId, planetId: planetToMove })
    })
  })
}

function getFirstNeighbor(planet: PlanetData) {
  for (const [key, value] of Object.entries(planet.neighborPlanets ?? {})) {
    if (value) return { key, value }
  }
  return undefined
}

export { setUpStrategyStateHandlers }
