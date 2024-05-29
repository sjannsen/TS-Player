import makeRobot from '../models'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { extractRobotProps } from '../utils'
import { RobotDb } from './types'

type MoveRobotDependencies = {
  robotDb: RobotDb
}

type MoveRobotProps = {
  id?: string
  robotServiceId?: string
  planetToMove: string
}

export default function makeMoveRobot({ robotDb }: MoveRobotDependencies) {
  return function moveRobot({ id, robotServiceId, planetToMove }: MoveRobotProps) {
    if (!id && !robotServiceId) throw new RobotInvalidArgumentError(`An id is needed: ${id}, ${robotServiceId}`)
    if (!planetToMove) throw new RobotInvalidArgumentError(`A planet to move must be provided: ${planetToMove}`)

    const existingRobot = robotDb.find({ id, robotServiceId })
    if (!existingRobot) throw new RobotNotFoundError(`Robot with id: ${robotServiceId} not found`)

    const existingRobotProps = extractRobotProps({ robot: existingRobot })
    const robot = makeRobot({ ...existingRobotProps, currentPlanet: planetToMove })

    robotDb.update(robot)
    return robot
  }
}
