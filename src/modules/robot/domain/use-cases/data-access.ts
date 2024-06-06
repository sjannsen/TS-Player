import { RobotData } from '../models/robot'

export type RobotDb = {
  insert: ({ robotData }: { robotData: RobotData }) => Promise<RobotData>

  findById: (queryParams: QueryParams) => Promise<RobotData | null>

  findAll: ({ owner }: { owner?: 'Player' | 'Enemy' }) => Promise<RobotData[]>

  update: (robotData: Partial<RobotData>) => Promise<Partial<RobotData> | null>
}

export interface QueryParams {
  id?: string
  robotServiceId?: string
}

export type RobotFightResult = {
  robotServiceId: string
  availableHealth: number
  availableEnergy: number
  alive: boolean
}
