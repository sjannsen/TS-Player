import { Robot } from '../models/robot'

export type RobotDb = {
  insert: (robot: Robot) => Robot
  find: (queryParams: QueryParams) => Robot | undefined
  findAll: (queryParams?: QueryParams) => Robot[]
  update: (robot: Robot) => Robot
}

interface QueryParams {
  id?: string
  robotServiceId?: string
  playerId?: string
  playerIds?: string[]
}

type RobotFightResult = {
  robotServiceId: string
  availableHealth: number
  availableEnergy: number
  alive: boolean
}
