import logger from '../../../../utils/logger'
import makeRobot from '../models'
import { RobotData } from '../models/robot'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { RobotDb } from './data-access'

type MoveRobotDependencies = {
  robotDb: RobotDb
}

type MoveRobotProps = {
  id?: string
  robotServiceId?: string
  planetToMove: string
  movementDifficulty: number
}

export default function makeMoveRobot({ robotDb }: MoveRobotDependencies) {
  return async function moveRobot({
    id,
    robotServiceId,
    planetToMove,
    movementDifficulty,
  }: MoveRobotProps): Promise<RobotData> {
    const IDS_UNDEFINED_ERROR = `Id: ${id} and robotServiceId: ${robotServiceId} are undefined`
    const PLANET_TO_MOVE_UNDEFINED_ERROR = `PlanetToMove is undefined: ${planetToMove}`
    const MOVEMENT_DIFFICULTY_UNDEFINED_ERROR = `MovementDifficulty is undefined: ${movementDifficulty}`

    if (!id && !robotServiceId) throw new RobotInvalidArgumentError(IDS_UNDEFINED_ERROR)
    if (!planetToMove) throw new RobotInvalidArgumentError(PLANET_TO_MOVE_UNDEFINED_ERROR)
    if (!movementDifficulty) throw new RobotInvalidArgumentError(MOVEMENT_DIFFICULTY_UNDEFINED_ERROR)

    const existing = await robotDb.findById({ id, robotServiceId })
    if (!existing) throw new RobotNotFoundError(`Robot with id: ${robotServiceId} not found`)

    const robot = makeRobot({
      ...existing,
      currentPlanet: planetToMove,
      ...{
        attributes: {
          ...existing.attributes,
          energy: existing.attributes.energy - movementDifficulty,
        },
      },
    })

    logger.info(
      {
        robot: {
          robotServiceId: robot.getRobotServiceId(),
          energy: robot.getAttributes().energy,
          energyLost: movementDifficulty,
        },
        from: existing.currentPlanet,
        to: robot.getCurrentPlanet(),
      },
      'Robot moved with loss of energy'
    )

    const updated = await robotDb.update({
      id: robot.getId(),
      robotServiceId: robot.getRobotServiceId(),
      currentPlanet: robot.getCurrentPlanet(),
      attributes: robot.getAttributes(),
    })

    return { ...existing, ...updated }
  }
}
