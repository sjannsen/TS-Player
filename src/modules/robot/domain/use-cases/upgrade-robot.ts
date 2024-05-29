import makeRobot from '../models'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { extractRobotProps } from '../utils'
import { RobotDb } from './types'

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
  return function upgradeRobot({ id, robotServiceId, level, upgrade }: UpgradeRobotProps) {
    if (!id && !robotServiceId) throw new RobotInvalidArgumentError(`An id is needed: ${id}, ${robotServiceId}`)
    if (!level) throw new RobotInvalidArgumentError(`Level must not be undefined: ${level}`)
    if (!upgrade) throw new RobotInvalidArgumentError(`Upgrade must not be undefined: ${upgrade}`)

    const existingRobot = robotDb.find({ id, robotServiceId })
    if (!existingRobot) throw new RobotNotFoundError(`Robot with id: ${robotServiceId} not found`)

    const existingProps = extractRobotProps({ robot: existingRobot })
    const levelType = convertUpgradeTypeToLevel(upgrade)
    if (!levelType) throw new RobotInvalidArgumentError(`A valid upgrade type must be provided: ${upgrade}`)

    const robot = makeRobot({ ...existingProps, levels: { ...existingProps.levels, ...{ [levelType]: level } } })

    robotDb.update(robot)
    return robot
  }
}
