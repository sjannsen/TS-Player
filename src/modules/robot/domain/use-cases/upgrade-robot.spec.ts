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

  it('upgrades a robot level and calls data access', () => {
    const robot = upgradeRobot(upgrade)

    expect(mockRobotDb.find.mock.calls.length).toBe(1)
    expect(mockRobotDb.update.mock.calls.length).toBe(1)
    expect(robot.getLevels()['healthLevel']).toBe(3)
  })

  it('throws an error, if no id is provided', () => {
    expect(() => upgradeRobot({ ...upgrade, robotServiceId: undefined })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if level is undefined', () => {
    expect(() => upgradeRobot({ ...upgrade, level: undefined as unknown as number })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if upgrade is undefined', () => {
    expect(() => upgradeRobot({ ...upgrade, upgrade: '' as UpgradeType })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the upgrade type has no corresponding robot level', () => {
    expect(() => upgradeRobot({ ...upgrade, upgrade: 'InvalidType' as UpgradeType })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the robot does not exist', () => {
    expect(() => upgradeRobot({ ...upgrade, robotServiceId: 'invalidId' })).toThrow(RobotNotFoundError)
  })
})
