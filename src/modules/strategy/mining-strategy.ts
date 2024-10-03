import { ResourceType } from '../../shared/types'
import logger from '../../utils/logger'
import planetService from '../map/domain/use-cases'
import { mineResources } from '../robot/adapters/output/commands'
import { RobotData } from '../robot/domain/models/robot'
import { buyMiningLevelUpgrade } from './mining'

function mapResourceToMiningLevel(resource: ResourceType): number {
  switch (resource) {
    case 'COAL':
      return 0
    case 'IRON':
      return 1
    case 'GEM':
      return 2
    case 'GOLD':
      return 3
    case 'PLATIN':
      return 4
  }
}

export default async function getMiningStrategy({ robot }: { robot: RobotData }): Promise<boolean> {
  const planet = await planetService.getPlanet({ mapServiceId: robot.currentPlanet })
  const planetResource = planet?.resource
  const planetResourceType = planet?.resource?.resourceType

  if (!planet) throw new Error(`Planet of robot with ID ${robot.id} is not found`)
  if (!planetResource || planetResource.currentAmount == 0) return false

  if (planetResourceType) {
    logger.info({ planetResource, robot: robot.robotServiceId, level: robot.levels.miningLevel }, 'Robot is on resource 🤖⛏️')
    const resourceLevel = mapResourceToMiningLevel(planetResourceType)
    const currentMiningLevel = robot.levels.miningLevel
    const isMiningLevelTooLow = currentMiningLevel < resourceLevel

    if (isMiningLevelTooLow) {
      buyMiningLevelUpgrade({ robot })
      return false
    }
  }

  mineResources({ robotId: robot.robotServiceId })
  return true
}
