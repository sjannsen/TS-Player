import { Robot } from '../models/robot'

export type RobotDb = {
  insert: (robot: Robot) => Robot
  find: (queryParams: QueryParams) => Robot | undefined
  findAll: () => Robot[]
  update: (robot: Robot) => Robot
}

interface QueryParams {
  id?: string
  robotServiceId?: string
}

type RobotFightResult = {
  robotServiceId: string
  availableHealth: number
  availableEnergy: number
  alive: boolean
}
