import makeRobot from '../models'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { extractRobotProps } from '../utils'
import { RobotDb } from './types'

type RegenerateRobotDependencies = {
  robotDb: RobotDb
}

type RegenerateRobotProps = {
  id?: string
  robotServiceId?: string
  availableEnergy: number
}

export default function makeRegenerateRobot({ robotDb }: RegenerateRobotDependencies) {
  return function ({ id, robotServiceId, availableEnergy }: RegenerateRobotProps) {
    if (!id && !robotServiceId) throw new RobotInvalidArgumentError(`An id is needed: ${id}, ${robotServiceId}`)
    if (!availableEnergy) throw new RobotInvalidArgumentError(`Level must not be undefined: ${availableEnergy}`)

    const existingRobot = robotDb.find({ id, robotServiceId })
    if (!existingRobot)
      throw new RobotNotFoundError(`Robot with id: ${id}, robotServiceId: ${robotServiceId} not found`)

    const existingProps = extractRobotProps({ robot: existingRobot })
    const robot = makeRobot({ ...existingProps, attributes: { ...existingProps.attributes, energy: availableEnergy } })

    robotDb.update(robot)
    return robot
  }
}
