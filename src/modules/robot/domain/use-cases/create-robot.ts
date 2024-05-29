import makeRobot from '../models'
import { MakeRobotProps, Robot } from '../models/robot'
import { RobotDb } from './types'

type CreateRobotDependencies = {
  robotDb: RobotDb
}

type CreateRobotProps = {
  robot: MakeRobotProps
}

export default function makeCreateRobot({ robotDb }: CreateRobotDependencies) {
  return function createRobot({ robot }: CreateRobotProps): Robot {
    const exists = robotDb.find({ id: robot.id, robotServiceId: robot.robotServiceId })
    if (exists) return exists

    const createdRobot = makeRobot(robot)
    robotDb.insert(createdRobot)
    return createdRobot
  }
}
