import { Robot } from '../../domain/models/robot'
import { RobotDb } from '../../domain/use-cases/types'

const robotDb: RobotDb = {
  find: () => ({}) as Robot,
  findAll: () => [],
  insert: () => ({}) as Robot,
  update: () => ({}) as Robot,
}

export default robotDb
