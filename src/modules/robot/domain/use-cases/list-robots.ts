import { RobotDb } from './types'

type ListRobotsDependencies = {
  robotDb: RobotDb
}

export default function makeListRobots({ robotDb }: ListRobotsDependencies) {
  return function () {
    return robotDb.findAll()
  }
}
