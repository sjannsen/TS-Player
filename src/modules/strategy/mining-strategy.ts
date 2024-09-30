import logger from '../../utils/logger'
import planetService from '../map/domain/use-cases'
import { mineResources } from '../robot/adapters/output/commands'
import { RobotData } from '../robot/domain/models/robot'

export default async function getMiningStrategy({ robot }: { robot: RobotData }): Promise<boolean> {
    const planet = await planetService.getPlanet({ mapServiceId: robot.currentPlanet })
    const planetResource = planet?.resource

    if (!planet) throw new Error(`Planet of robot with ID ${robot.id} is not found`)

    const planetHasNoResource = !planetResource
    if (planetHasNoResource) return false;

    const planetsResourcesExhausted = planetResource.currentAmount == 0
    if (planetsResourcesExhausted) return false

    // TODO: Compare with mining level of robot
    if (planetResource.resourceType != 'COAL') {
      const miningLevelTooLowMessage = `Robot has to low mining level ${robot.levels.miningLevel} to mine resource ${planetResource.resourceType}`

      logger.warn(miningLevelTooLowMessage)
      return false
    }

    mineResources({ robotId: robot.robotServiceId })
    return true
}
