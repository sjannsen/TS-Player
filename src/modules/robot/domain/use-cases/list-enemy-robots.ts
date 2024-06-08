import { RobotData } from '../models/robot'
import { RobotDb } from './data-access'

type ListEnemyRobotsDependencies = {
  robotDb: RobotDb
}

type ListEnemyRobotsProps = {
  enemyPlayerIds: string[]
}

export default function makeListEnemyRobots({ robotDb }: ListEnemyRobotsDependencies) {
  return async function listEnemyRobots({ enemyPlayerIds }: ListEnemyRobotsProps): Promise<RobotData[]> {
    const robots = await robotDb.findAll({ owner: 'Enemy' })
    return robots.filter((robot) => enemyPlayerIds.includes(robot.player))
  }
}
