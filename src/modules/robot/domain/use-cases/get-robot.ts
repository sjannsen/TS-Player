import { RobotInvalidArgumentError } from '../models/robot.errors'
import { QueryParams, RobotDb } from './types'

type GetRobotDependencies = {
  robotDb: RobotDb
}

type GetRobotProps = {
  queryParams: QueryParams
}

export default function makeGetRobot({ robotDb }: GetRobotDependencies) {
  return function ({ queryParams }: GetRobotProps) {
    if (Object.keys(queryParams).length == 0)
      throw new RobotInvalidArgumentError(`At least one query param needs to be provided: ${queryParams}`)

    return robotDb.find(queryParams)
  }
}
