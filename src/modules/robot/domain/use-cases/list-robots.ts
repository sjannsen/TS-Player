import { RobotData } from '../models/robot'
import { RobotDb } from './data-access'
import { RobotData } from '../models/robot'
import { RobotDb } from './data-access'

type ListRobotsDependencies = {
  robotDb: RobotDb
}

type ListRobotProps = {
  owner?: { owner?: 'Player' | 'Enemy' }
}

export default function makeListRobots({ robotDb }: ListRobotsDependencies) {
  return async function listRobots({ owner = { owner: 'Player' } }: ListRobotProps): Promise<RobotData[]> {
    return await robotDb.findAll(owner)
  }
}
