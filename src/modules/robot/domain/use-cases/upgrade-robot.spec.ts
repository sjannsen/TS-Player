import { UpgradeType } from '../../../../event-handling/robot/robot.types'
import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import { clearMockRobotDb, mockRobotDb } from './mocks/mock'
import makeUpgradeRobot, { UpgradeRobotProps } from './upgrade-robot'

describe('upgradeRobot', () => {
  const upgradeRobot = makeUpgradeRobot({ robotDb: mockRobotDb })
  const upgrade: UpgradeRobotProps = {
    robotServiceId: 'robotId',
    level: 3,
    upgrade: 'HEALTH',
  }

  beforeEach(() => {
    clearMockRobotDb()
  })

  it('upgrades a robot level and calls data access', async () => {
    const robot = await upgradeRobot(upgrade)

    expect(mockRobotDb.findById.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
    expect(robot.levels['healthLevel']).toBe(3)
  })

  it('throws an error, if no id is provided', async () => {
    await expect(upgradeRobot({ ...upgrade, robotServiceId: undefined })).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if level is undefined', async () => {
    await expect(upgradeRobot({ ...upgrade, level: undefined as unknown as number })).rejects.toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error, if upgrade is undefined', async () => {
    await expect(upgradeRobot({ ...upgrade, upgrade: '' as UpgradeType })).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the upgrade type has no corresponding robot level', async () => {
    await expect(upgradeRobot({ ...upgrade, upgrade: 'InvalidType' as UpgradeType })).rejects.toThrow(
      RobotInvalidArgumentError
    )
  })

  it('throws an error, if the robot does not exist', async () => {
    await expect(upgradeRobot({ ...upgrade, robotServiceId: 'invalidId' })).rejects.toThrow(RobotNotFoundError)
  })
})
