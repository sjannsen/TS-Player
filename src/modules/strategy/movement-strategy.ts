import logger from '../../utils/logger'
import { NeighborPlanets, PlanetData } from '../map/domain/model/planet'
import planetService from '../map/domain/use-cases'
import { moveRobot } from '../robot/adapters/output/commands'
import { RobotData } from '../robot/domain/models/robot'

export default async function getMovementStrategy({ robot }: { robot: RobotData }): Promise<boolean> {
    logger.info(`Get movement strategy for robot ${robot.robotServiceId}`)
    const planet = await planetService.getPlanet({ mapServiceId: robot.currentPlanet })

    if (!planet) throw new Error(`Planet for Robot with Id: ${robot.id} is undefined`)
    if (hasPlanetResource({ planet, robot })) return false
    if (!hasNeighbors({ planet })) return false
    if (!canLeavePlanet({ planet, robot })) return false

    const firstNeighborId = getFirstNeighborId(planet.neighborPlanets!)
    if (!firstNeighborId) {
        const planetHasNoNeighborsMessage = 'Robot is on planet without neigbors'

        logger.warn(planetHasNoNeighborsMessage)
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

function canLeavePlanet({ planet, robot }: { planet: PlanetData; robot: RobotData }): boolean {
    const planetMovementDifficulty = planet.movementDifficulty
    if (!planetMovementDifficulty) return false

    const robotEnergy = robot.attributes.energy
    const robotHasEnoughEnergyToLeavePlanet = robotEnergy < planetMovementDifficulty

    if (!robotHasEnoughEnergyToLeavePlanet) {
        const notEnoughEnergyMessage = `Cannot move robot ${robot.robotServiceId} because energy is to low`
        logger.warn(notEnoughEnergyMessage)
    }

    return robotHasEnoughEnergyToLeavePlanet
}

function hasPlanetResource({ planet, robot }: { planet: PlanetData; robot: RobotData }): boolean {
    const planetResource = planet?.resource
    if (!planetResource) return false

    if (planetResource.currentAmount == 0) {
        const exhaustedResourcesMessage = `Robot ${robot.robotServiceId} is on planet ${robot.currentPlanet} with exausted resource ${planetResource.resourceType}:${planetResource.currentAmount}`
        logger.info(exhaustedResourcesMessage)
        return false
    }

    return true
}

function hasNeighbors({ planet }: { planet: PlanetData }): boolean {
    const planetNeighbors = planet?.neighborPlanets
    if (!planetNeighbors) {
        const neighborsUndefinedMessage = `Neighbor planets of planet ${planet?.mapServiceId} are undefined`
        logger.warn(neighborsUndefinedMessage)
        return false
    }

    return Object.values(planetNeighbors).some((planetId) => planetId !== undefined && planetId !== null)
}
