import logger from '../../../../utils/logger'
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
  movementDifficulty: number
}

export default function makeMoveRobot({ robotDb }: MoveRobotDependencies) {
  return function moveRobot({ id, robotServiceId, planetToMove, movementDifficulty }: MoveRobotProps) {
    if (!id && !robotServiceId) throw new RobotInvalidArgumentError(`An id is needed: ${id}, ${robotServiceId}`)
    if (!planetToMove) throw new RobotInvalidArgumentError(`A planet to move must be provided: ${planetToMove}`)
    if (!movementDifficulty)
      throw new RobotInvalidArgumentError(`Movement difficulty must be provided: ${movementDifficulty}`)

    const existingRobot = robotDb.find({ id, robotServiceId })
    if (!existingRobot) throw new RobotNotFoundError(`Robot with id: ${robotServiceId} not found`)

    const existingRobotProps = extractRobotProps({ robot: existingRobot })
    const robot = makeRobot({
      ...existingRobotProps,
      currentPlanet: planetToMove,
      ...{
        attributes: {
          ...existingRobotProps.attributes,
          energy: existingRobotProps.attributes.energy - movementDifficulty,
        },
      },
    })

    logger.info(
      {
        robot: {
          robotServiceId: robot.getRobotServiceId(),
          energy: robot.getAttributes().energy,
          energyLost: movementDifficulty,
        },
        from: existingRobot.getCurrentPlanet(),
        to: robot.getCurrentPlanet(),
      },
      'Robot moved with loss of energy'
    )

    robotDb.update(robot)
    return robot
  }
}
