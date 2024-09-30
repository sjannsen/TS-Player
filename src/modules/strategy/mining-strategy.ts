import logger from '../../utils/logger'
import planetService from '../map/domain/use-cases'
import { mineResources } from '../robot/adapters/output/commands'
import { RobotData } from '../robot/domain/models/robot'

export default async function getMiningStrategy({ robot }: { robot: RobotData }): Promise<boolean> {
    const planet = await planetService.getPlanet({ mapServiceId: robot.currentPlanet })
    if (!planet?.resource || planet.resource.currentAmount == 0) return false

    logger.info(
      `Mining resource ${planet.resource.resourceType}:${planet.resource.currentAmount} with robot ${robot.robotServiceId} on planet ${robot.currentPlanet}`
    )

    // TODO: Compare with mining level of robot
    if (planet.resource.resourceType != 'COAL') {
      logger.warn(
        `Robot has to low mining level ${robot.levels.miningLevel} to mine resource ${planet.resource.resourceType}`
      )
      return false
    }

    mineResources({ robotId: robot.robotServiceId })
    return true
}
