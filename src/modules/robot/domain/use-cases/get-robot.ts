import { RobotData } from '../models/robot'
import { RobotInvalidArgumentError } from '../models/robot.errors'
import { QueryParams, RobotDb } from './data-access'

type GetRobotDependencies = {
  robotDb: RobotDb
}

type GetRobotProps = {
  queryParams: QueryParams
}

export default function makeGetRobot({ robotDb }: GetRobotDependencies) {
  return async function getRobot({ queryParams }: GetRobotProps): Promise<RobotData | null> {
    if (Object.keys(queryParams).length == 0)
      throw new RobotInvalidArgumentError(`At least one query param needs to be provided: ${queryParams}`)

    return await robotDb.findById(queryParams)
  }
}
