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
    const planetResource = planet?.resource

    const planetHasNoResource = !planetResource
    if (planetHasNoResource) return false

    const planetsResourcesExhausted = planetResource.currentAmount > 0
    if (planetsResourcesExhausted) {
      const planetsResourcesExhaustedMessage = `Robot ${robot.robotServiceId} is on planet ${robot.currentPlanet} with resource ${planetResource.resourceType}:${planetResource.currentAmount}`

      logger.info(planetsResourcesExhaustedMessage)
      return false
    }

    const planetNeighbors = planet?.neighborPlanets
    const planetNeighborsUndefined =!planetNeighbors
    if (planetNeighborsUndefined) {
      const planetNeighborsUndefinedMessage = `Neighbor planets of planet ${planet?.mapServiceId} are undefined`
      logger.warn(planetNeighborsUndefinedMessage)
      return false
    }

    const firstNeighborId = getFirstNeighborId(planetNeighbors)

    if (!firstNeighborId) {
      const planetWithNoNeighborsMessage = 'Robot is on planet without neigbors'
      logger.warn(planetWithNoNeighborsMessage)
      return false
    }

    const planetMovementDifficulty = planet.movementDifficulty
    if (!planetMovementDifficulty) return false

    const robotEnergy = robot.attributes.energy
    const robotHasEnoughEnergyToLeavePlanet = robotEnergy < planetMovementDifficulty
    if (!robotHasEnoughEnergyToLeavePlanet) {
      const robotNotEnoughEnergyMessage = `Cannot move robot ${robot.robotServiceId} because energy is to low`
      logger.warn(robotNotEnoughEnergyMessage)
      return false
    }

    const moveRobotMessage = `Move robot ${robot.robotServiceId} to planet ${firstNeighborId}`
    logger.info(moveRobotMessage)
    moveRobot({ robotId: robot.robotServiceId, planetId: firstNeighborId })
    return true
}

function getFirstNeighborId(neighborPlanets: NeighborPlanets) {
  for (const [, firstNeighborId] of Object.entries(neighborPlanets)) {
    if (firstNeighborId) return firstNeighborId
  }
  return undefined
}
