import { UpgradeType } from '../../../../shared/types'
import makeRobot from '../models'
import { RobotData } from '../models/robot'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { RobotLevels } from '../models/types'
import { RobotDb } from './data-access'

type UpgradeRobotDependencies = {
  robotDb: RobotDb
}

export type UpgradeRobotProps = {
  id?: string
  robotServiceId?: string
  level: number
  upgrade: UpgradeType
}

function convertUpgradeTypeToLevel(upgrade: UpgradeType): keyof RobotLevels | undefined {
  switch (upgrade) {
    case 'DAMAGE':
      return 'damageLevel'
    case 'ENERGY_REGEN':
      return 'energyRegenLevel'
    case 'HEALTH':
      return 'healthLevel'
    case 'MAX_ENERGY':
      return 'energyLevel'
    case 'MINING':
      return 'miningLevel'
    case 'MINING_SPEED':
      return 'miningSpeedLevel'
    case 'STORAGE':
      return 'storageLevel'
    default:
      break
  }
}

export default function makeUpgradeRobot({ robotDb }: UpgradeRobotDependencies) {
  return async function upgradeRobot({ id, robotServiceId, level, upgrade }: UpgradeRobotProps): Promise<RobotData> {
    const IDS_UNDEFINED_ERROR = `Id: ${id} and robotServiceId: ${robotServiceId} are undefined`
    const LEVEL_UNDEFINED_ERROR = `Level: ${level} is undefined`
    const UPGRADE_UNDEFINED_ERROR = `Upgrade: ${upgrade} is undefined`

    if (!id && !robotServiceId) throw new RobotInvalidArgumentError(IDS_UNDEFINED_ERROR)
    if (!level) throw new RobotInvalidArgumentError(LEVEL_UNDEFINED_ERROR)
    if (!upgrade) throw new RobotInvalidArgumentError(UPGRADE_UNDEFINED_ERROR)

    const existing = await robotDb.findById({ id, robotServiceId })
    if (!existing) throw new RobotNotFoundError(`Robot with id: ${id}, robotServiceId: ${robotServiceId} not found`)

    const levelType = convertUpgradeTypeToLevel(upgrade)
    if (!levelType) throw new RobotInvalidArgumentError(`LevelType: ${levelType} is invalid`)

    const robot = makeRobot({ ...existing, levels: { ...existing.levels, ...{ [levelType]: level } } })

    const updated = await robotDb.update({
      id: robot.getId(),
      levels: robot.getLevels(),
    })

    return { ...existing, ...updated }
  }
}
