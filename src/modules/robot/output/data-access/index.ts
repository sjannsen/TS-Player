import { Robot } from '../../domain/models/robot'
import { QueryParams, RobotDb } from '../../domain/use-cases/types'

const robotData: Robot[] = []

const matchesId = (robot: Robot, id: string | undefined) => !id || robot.getId() == id
const matchesRobotServiceId = (robot: Robot, id: string | undefined) => !id || robot.getRobotServiceId() == id
const matchesIds = (robot: Robot, ids: string[] | undefined) =>
  !ids || ids.length == 0 || ids.includes(robot.getPlayer())

function findRobot({ id, robotServiceId }: QueryParams) {
  return robotData.find((robot) => matchesId(robot, id) && matchesRobotServiceId(robot, robotServiceId))
}

function findAll(queryParams?: QueryParams) {
  return robotData.filter((r) => matchesIds(r, queryParams?.playerIds))
}

const robotDb: RobotDb = {
  find: findRobot,
  findAll,
  insert: (robot: Robot) => {
    robotData.push(robot)
    return robot
  },
  update: (robot: Robot) => {
    const index = robotData.findIndex(
      (r) => r.getId() == robot.getId() && r.getRobotServiceId() == robot.getRobotServiceId()
    )
    robotData[index] = robot
    return robot
  },
}

export default robotDb
