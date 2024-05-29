import makeRobot from '../models'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { extractRobotProps } from '../utils'
import { RobotDb } from './types'

type RestoreAttributeDependencies = {
  robotDb: RobotDb
}

type RestoreAttributeProps = {
  id?: string
  robotServiceId?: string
  restorationType: 'HEALTH' | 'ENERGY'
  availableEnergy?: number
  availableHealth?: number
}

export default function makeRestoreAttribute({ robotDb }: RestoreAttributeDependencies) {
  return function restoreAttribute({
    id,
    robotServiceId,
    restorationType,
    availableEnergy,
    availableHealth,
  }: RestoreAttributeProps) {
    if (!id && !robotServiceId) throw new RobotInvalidArgumentError(`An id is needed: ${id}, ${robotServiceId}`)
    if (!robotServiceId) throw new RobotInvalidArgumentError(`RobotServiceId must not be undefined: ${robotServiceId}`)
    if (!restorationType)
      throw new RobotInvalidArgumentError(`RestorationType must not be undefined: ${restorationType}`)
    if (!availableEnergy && !availableHealth)
      throw new RobotInvalidArgumentError(
        `AvailableEnergy or availableEnergy must not be provided: Energy: ${availableEnergy}, Health: ${availableHealth}`
      )
    if (restorationType == 'HEALTH' && !availableHealth)
      throw new RobotInvalidArgumentError(
        `RestorationType HEALTH must provide availableHealth must not be undefined: ${availableHealth}`
      )
    if (restorationType == 'ENERGY' && !availableEnergy)
      throw new RobotInvalidArgumentError(
        `RestorationType ENERGY must provide availableEnergy must not be undefined: ${availableEnergy}`
      )

    if (availableEnergy && availableEnergy < 0)
      throw new RobotInvalidArgumentError(`AvailableEnergy must not be negative: ${availableEnergy}`)
    if (availableHealth && availableHealth < 0)
      throw new RobotInvalidArgumentError(`AvailableHealth must not be negative: ${availableHealth}`)

    const existingRobot = robotDb.find({ id, robotServiceId })
    if (!existingRobot) throw new RobotNotFoundError(`Robot with id: ${robotServiceId} not found`)

    const existingProps = extractRobotProps({ robot: existingRobot })
    let updatedAttributes: Partial<RobotAttributes> = {}

    if (availableHealth && !availableEnergy) updatedAttributes = { health: availableHealth }
    if (!availableHealth && availableEnergy) updatedAttributes = { energy: availableEnergy }
    if (availableHealth && availableEnergy) updatedAttributes = { energy: availableEnergy, health: availableHealth }

    const robot = makeRobot({
      ...existingProps,
      ...{ attributes: { ...existingProps.attributes, ...updatedAttributes } },
    })

    robotDb.update(robot)
    return robot
  }
}
