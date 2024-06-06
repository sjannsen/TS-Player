import { RobotDb } from './data-access'

type ListEnemyRobotsDependencies = {
  robotDb: RobotDb
}

type ListEnemyRobotsProps = {
  enemyPlayerIds: string[]
}

export default function makeListEnemyRobots({ robotDb }: ListEnemyRobotsDependencies) {
  return function listEnemyRobots({ enemyPlayerIds }: ListEnemyRobotsProps) {
    return robotDb.findAll({ playerIds: enemyPlayerIds })
  }
}
