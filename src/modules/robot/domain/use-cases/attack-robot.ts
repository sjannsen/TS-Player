import makeRobot from '../models'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { RobotAttributes } from '../models/types'
import { RobotDb, RobotFightResult } from './data-access'

type AttackRobotDependencies = {
  robotDb: RobotDb
}

type AttackRobotProps = { attacker: RobotFightResult; target: RobotFightResult }

export default function makeAttackRobot({ robotDb }: AttackRobotDependencies) {
  return async function AttackRobot({ attacker, target }: AttackRobotProps) {
    if (!attacker.robotServiceId)
      throw new RobotInvalidArgumentError(`RobotServiceId must not be undefined: ${attacker.robotServiceId}`)

    if (!attacker.availableHealth)
      throw new RobotInvalidArgumentError(`Available health must not be undefined: ${attacker.availableHealth}`)

    if (!attacker.availableEnergy)
      throw new RobotInvalidArgumentError(`Available energy must not be undefined: ${attacker.availableEnergy}`)

    if (!attacker.alive) throw new RobotInvalidArgumentError(`Alive must not be undefined: ${attacker.alive}`)

    if (!target.robotServiceId)
      throw new RobotInvalidArgumentError(`RobotServiceId must not be undefined: ${target.robotServiceId}`)

    if (!target.availableHealth)
      throw new RobotInvalidArgumentError(`Available health must not be undefined: ${target.availableHealth}`)

    if (!target.availableEnergy)
      throw new RobotInvalidArgumentError(`Available energy must not be undefined: ${target.availableEnergy}`)

    if (!target.alive) throw new RobotInvalidArgumentError(`Alive must not be undefined: ${target.alive}`)

    const existingAttacker = await robotDb.findById({ robotServiceId: attacker.robotServiceId })
    const existingTarget = await robotDb.findById({ robotServiceId: target.robotServiceId })

    if (!existingAttacker) throw new RobotNotFoundError()
    if (!existingTarget) throw new RobotNotFoundError()

    const attackerAttributes: Partial<RobotAttributes> = {
      health: attacker.availableHealth,
      energy: attacker.availableEnergy,
    }
    const targetAttributes: Partial<RobotAttributes> = {
      health: target.availableHealth,
      energy: target.availableEnergy,
    }

    const attackRobot = makeRobot({
      ...existingAttacker,
      attributes: {
        ...existingAttacker.attributes,
        ...attackerAttributes,
      },
    })

    const targetRobot = makeRobot({
      ...existingTarget,
      attributes: {
        ...existingTarget.attributes,
        ...targetAttributes,
      },
    })

    return { attacker: attackRobot, target: targetRobot }
  }
}
