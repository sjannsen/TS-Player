import logger from '../../utils/logger'
import { NeighborPlanets } from '../map/domain/model/planet'
import planetService from '../map/domain/use-cases'
import { moveRobot } from '../robot/adapters/output/commands'
import { RobotData } from '../robot/domain/models/robot'

export default async function getMovementStrategy({robot}: { robot: RobotData}): Promise<boolean> {
  logger.info('Get MovementStrategy')

    logger.info(`Get movement strategy for robot ${robot.robotServiceId}`)
    const planetId = robot.currentPlanet
    const planet = await planetService.getPlanet({ mapServiceId: planetId })

    if (planet?.resource && planet.resource.currentAmount > 0) {
      logger.info(
        `Robot ${robot.robotServiceId} is on planet ${robot.currentPlanet} with resource ${planet.resource.resourceType}:${planet.resource.currentAmount}`
      )
      return false
    }

    if (!planet?.neighborPlanets) {
      logger.warn(`Neighbor planets of planet ${planet?.mapServiceId} are undefined`)
      return false
    }

    const firstNeighborId = getFirstNeighborId(planet?.neighborPlanets)

    if (!firstNeighborId) {
      logger.warn('Robot is on planet without neigbors')
      return false
    }

    if (planet.movementDifficulty && robot.attributes.energy < planet.movementDifficulty) {
      logger.warn(`Cannot move robot ${robot.robotServiceId} because energy is to low`)
      return false
    }

    logger.info(`Move robot ${robot.robotServiceId} to planet ${firstNeighborId}`)
    moveRobot({ robotId: robot.robotServiceId, planetId: firstNeighborId })
    return true
}

function getFirstNeighborId(neighborPlanets: NeighborPlanets) {
  for (const [, firstNeighborId] of Object.entries(neighborPlanets)) {
    if (firstNeighborId) return firstNeighborId
  }
  return undefined
}
