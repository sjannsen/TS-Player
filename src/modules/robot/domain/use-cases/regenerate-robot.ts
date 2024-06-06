import makeRobot from '../models'
import { RobotData } from '../models/robot'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { RobotDb } from './data-access'

type RegenerateRobotDependencies = {
  robotDb: RobotDb
}

type RegenerateRobotProps = {
  id?: string
  robotServiceId?: string
  availableEnergy: number
}

export default function makeRegenerateRobot({ robotDb }: RegenerateRobotDependencies) {
  return async function regenerateRobot({
    id,
    robotServiceId,
    availableEnergy,
  }: RegenerateRobotProps): Promise<RobotData> {
    const IDS_UNDEFINED_ERROR = `Id: ${id} and robotServiceId: ${robotServiceId} are undefined`
    const AVAILABLE_ENERGY_UNDEFINED_ERROR = `Level is undefined: ${availableEnergy}`

    if (!id && !robotServiceId) throw new RobotInvalidArgumentError(IDS_UNDEFINED_ERROR)
    if (!availableEnergy) throw new RobotInvalidArgumentError(AVAILABLE_ENERGY_UNDEFINED_ERROR)

    const existing = await robotDb.findById({ id, robotServiceId })
    if (!existing) throw new RobotNotFoundError(`Robot with id: ${id}, robotServiceId: ${robotServiceId} not found`)

    const robot = makeRobot({ ...existing, attributes: { ...existing.attributes, energy: availableEnergy } })

    const updated = await robotDb.update({
      id: robot.getId(),
      robotServiceId: robot.getRobotServiceId(),
      attributes: robot.getAttributes(),
    })

    return { ...existing, ...updated }
  }
}
