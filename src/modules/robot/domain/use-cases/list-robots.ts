import { RobotData } from '../models/robot'
import { RobotDb } from './data-access'

type ListRobotsDependencies = {
  robotDb: RobotDb
}

export default function makeListRobots({ robotDb }: ListRobotsDependencies) {
  return async function listRobots(): Promise<RobotData[]> {
    return await robotDb.findAll({ owner: 'Player' })
  }
}
