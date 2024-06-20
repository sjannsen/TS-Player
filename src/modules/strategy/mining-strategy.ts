import logger from '../../utils/logger'
import planetService from '../map/domain/use-cases'
import { mineResources } from '../robot/adapters/output/commands'
import robotService from '../robot/domain/use-cases'

export default async function getMiningStrategy() {
  const robots = await robotService.listRobots()

  robots.forEach(async (robot) => {
    const planet = await planetService.getPlanet({ mapServiceId: robot.currentPlanet })
    if (!planet?.resource || planet.resource.currentAmount == 0) return

    logger.info(
      `Mining resource ${planet.resource.resourceType}:${planet.resource.currentAmount} with robot ${robot.robotServiceId} on planet ${robot.currentPlanet}`
    )

    if (planet.resource.resourceType != 'COAL') {
      logger.warn(
        `Robot has to low mining level ${robot.levels.miningLevel} to mine resource ${planet.resource.resourceType}`
      )
      return
    }

    mineResources({ robotId: robot.robotServiceId })
  })
}
