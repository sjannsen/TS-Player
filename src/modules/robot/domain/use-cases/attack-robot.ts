import makeRobot from '../models'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { RobotAttributes } from '../models/types'
import { extractRobotProps } from '../utils'
import { RobotDb, RobotFightResult } from './types'

type AttackRobotDependencies = {
  robotDb: RobotDb
}

type AttackRobotProps = { attacker: RobotFightResult; target: RobotFightResult }

export default function makeAttackRobot({ robotDb }: AttackRobotDependencies) {
  return function AttackRobot({ attacker, target }: AttackRobotProps) {
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

    const existingAttacker = robotDb.find({ robotServiceId: attacker.robotServiceId })
    const existingTarget = robotDb.find({ robotServiceId: target.robotServiceId })

    if (!existingAttacker) throw new RobotNotFoundError()
    if (!existingTarget) throw new RobotNotFoundError()

    const attackerProps = extractRobotProps({ robot: existingAttacker })
    const targetProps = extractRobotProps({ robot: existingTarget })

    const attackerAttributes: Partial<RobotAttributes> = {
      health: attacker.availableHealth,
      energy: attacker.availableEnergy,
    }
    const targetAttributes: Partial<RobotAttributes> = {
      health: target.availableHealth,
      energy: target.availableEnergy,
    }

    const attackRobot = makeRobot({
      ...attackerProps,
      attributes: {
        ...attackerProps.attributes,
        ...attackerAttributes,
      },
    })

    const targetRobot = makeRobot({
      ...attackerProps,
      attributes: {
        ...targetProps.attributes,
        ...targetAttributes,
      },
    })

    return { attacker: attackRobot, target: targetRobot }
  }
}

// const attackRobot = makeRobot({
//   id: existingAttacker.getId(),
//   robotServiceId: existingAttacker.getRobotServiceId(),
//   player: existingAttacker.getPlayer(),
//   alive: attacker.alive,
//   attributes: {
//     ...existingAttacker.getAttributes(),
//     health: attacker.availableHealth,
//     energy: attacker.availableEnergy,
//   },
//   levels: existingAttacker.getLevels(),
//   inventory: {
//     storageLevel: existingAttacker.getInventory().getStorageLevel(),
//     maxStorage: existingAttacker.getInventory().getMaxStorage(),
//     storage: existingAttacker.getInventory().getStorage(),
//   },
//   currentPlanet: existingAttacker.getCurrentPlanet(),
// })

// const targetRobot = makeRobot({
//   id: existingTarget.getId(),
//   robotServiceId: existingTarget.getRobotServiceId(),
//   player: existingTarget.getPlayer(),
//   alive: target.alive,
//   attributes: {
//     ...existingTarget.getAttributes(),
//     health: target.availableHealth,
//     energy: target.availableEnergy,
//   },
//   levels: existingTarget.getLevels(),
//   inventory: {
//     storageLevel: existingTarget.getInventory().getStorageLevel(),
//     maxStorage: existingTarget.getInventory().getMaxStorage(),
//     storage: existingTarget.getInventory().getStorage(),
//   },
//   currentPlanet: existingTarget.getCurrentPlanet(),
// })
