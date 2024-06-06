import { RobotData } from '../models/robot'
import { RobotDb } from './data-access'

type CreateRobotDependencies = {
  robotDb: RobotDb
}

type CreateRobotProps = {
  robotData: RobotData
}

export default function makeCreateRobot({ robotDb }: CreateRobotDependencies) {
  return async function createRobot({ robotData }: CreateRobotProps): Promise<RobotData> {
    const exists = await robotDb.findById({ id: robotData.id, robotServiceId: robotData.robotServiceId })

    if (exists) return exists

    const created = await robotDb.insert({ robotData })
    return created
  }
}
