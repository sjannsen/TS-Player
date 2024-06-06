import makeRobot from '../models'
import { RobotData } from '../models/robot'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { RobotAttributes } from '../models/types'
import { RobotDb } from './data-access'

type RestoreAttributeDependencies = {
  robotDb: RobotDb
}

type RestoreAttributeProps = {
  id?: string
  robotServiceId?: string
  restorationType: 'HEALTH' | 'ENERGY'
  availableEnergy?: number
  availableHealth?: number
}

export default function makeRestoreAttribute({ robotDb }: RestoreAttributeDependencies) {
  return async function restoreAttribute({
    id,
    robotServiceId,
    restorationType,
    availableEnergy,
    availableHealth,
  }: RestoreAttributeProps): Promise<RobotData> {
    const idsUndefinedError = `Id: ${id} and robotServiceId: ${robotServiceId} are undefined`
    const restorationTypeUndefinedError = `RestorationType: ${restorationType} is undefined`
    const restorationValuesUndefinedError = `AvailableEnergy: ${availableEnergy} or availableHealth: ${availableHealth} must be provided`
    const restorationTypeHealthValueUndefinedError = `RestorationType HEALTH must provide availableHealth must not be undefined: ${availableHealth}`
    const restorationTypeEnergyValueUndefinedError = `RestorationType ENERGY must provide availableEnergy must not be undefined: ${availableEnergy}`

    if (!id && !robotServiceId) throw new RobotInvalidArgumentError(idsUndefinedError)
    if (!restorationType) throw new RobotInvalidArgumentError(restorationTypeUndefinedError)
    if (!availableEnergy && !availableHealth) throw new RobotInvalidArgumentError(restorationValuesUndefinedError)
    if (restorationType == 'HEALTH' && !availableHealth)
      throw new RobotInvalidArgumentError(restorationTypeHealthValueUndefinedError)
    if (restorationType == 'ENERGY' && !availableEnergy)
      throw new RobotInvalidArgumentError(restorationTypeEnergyValueUndefinedError)

    if (availableEnergy && availableEnergy < 0)
      throw new RobotInvalidArgumentError(`AvailableEnergy must not be negative: ${availableEnergy}`)
    if (availableHealth && availableHealth < 0)
      throw new RobotInvalidArgumentError(`AvailableHealth must not be negative: ${availableHealth}`)

    const existing = await robotDb.findById({ id, robotServiceId })
    if (!existing) throw new RobotNotFoundError(`Robot with id: ${robotServiceId} not found`)

    let updatedAttributes: Partial<RobotAttributes> = {}

    if (availableHealth && !availableEnergy) updatedAttributes = { health: availableHealth }
    if (!availableHealth && availableEnergy) updatedAttributes = { energy: availableEnergy }
    if (availableHealth && availableEnergy) updatedAttributes = { energy: availableEnergy, health: availableHealth }

    const robot = makeRobot({
      ...existing,
      ...{ attributes: { ...existing.attributes, ...updatedAttributes } },
    })

    const updated = await robotDb.update({ id: robot.getId(), attributes: robot.getAttributes() })

    return { ...existing, ...updated }
  }
}
