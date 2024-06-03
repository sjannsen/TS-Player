import { QueryParams, RobotDb } from './types'

type ListRobotsDependencies = {
  robotDb: RobotDb
}

type ListRobotProps = {
  queryParams?: QueryParams
}

export default function makeListRobots({ robotDb }: ListRobotsDependencies) {
  return function listRobots({ queryParams }: ListRobotProps) {
    return robotDb.findAll(queryParams)
  }
}
