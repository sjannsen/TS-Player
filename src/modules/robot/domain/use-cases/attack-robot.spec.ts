import { RobotInvalidArgumentError, RobotNotFoundError } from '../models/robot.errors'
import makeAttackRobot from './attack-robot'
import { clearMockRobotDb, mockRobotDb } from './mocks/mock'
import { RobotFightResult } from './data-access'

describe('attackRobot', () => {
  const attackRobot = makeAttackRobot({ robotDb: mockRobotDb })
  const AttackerFightResult: RobotFightResult = {
    alive: true,
    availableEnergy: 10,
    availableHealth: 10,
    robotServiceId: 'robotId',
  }
  const TargetFightResult: RobotFightResult = {
    alive: true,
    availableEnergy: 50,
    availableHealth: 50,
    robotServiceId: 'invalidRobotId',
  }

  beforeEach(() => {
    clearMockRobotDb()
  })

  it('attacks a robot', async () => {
    const attackRobot = makeAttackRobot({ robotDb: mockRobotDb })
    const AttackerFightResult: RobotFightResult = {
      alive: true,
      availableEnergy: 10,
      availableHealth: 10,
      robotServiceId: 'robotId',
    }
    const TargetFightResult: RobotFightResult = {
      alive: true,
      availableEnergy: 50,
      availableHealth: 50,
      robotServiceId: 'robotId',
    }

    const { attacker, target } = await attackRobot({ attacker: AttackerFightResult, target: TargetFightResult })

    expect(attacker.getAttributes().energy).toBe(10)
    expect(attacker.getAttributes().health).toBe(10)
    expect(attacker.isAlive()).toBe(true)
    expect(target.getAttributes().energy).toBe(50)
    expect(target.getAttributes().health).toBe(50)
    expect(target.isAlive()).toBe(true)
  })

  it('throws an error if attacker is not found', async () => {
    const attackRobot = makeAttackRobot({ robotDb: mockRobotDb })
    const AttackerFightResult: RobotFightResult = {
      alive: true,
      availableEnergy: 10,
      availableHealth: 10,
      robotServiceId: 'invalidRobotId',
    }
    const TargetFightResult: RobotFightResult = {
      alive: true,
      availableEnergy: 50,
      availableHealth: 50,
      robotServiceId: 'robotId',
    }

    await expect(attackRobot({ attacker: AttackerFightResult, target: TargetFightResult })).rejects.toThrow(
      RobotNotFoundError
    )
  })

  it('throws an error if target is not found', async () => {
    const attackRobot = makeAttackRobot({ robotDb: mockRobotDb })
    const AttackerFightResult: RobotFightResult = {
      alive: true,
      availableEnergy: 10,
      availableHealth: 10,
      robotServiceId: 'robotId',
    }
    const TargetFightResult: RobotFightResult = {
      alive: true,
      availableEnergy: 50,
      availableHealth: 50,
      robotServiceId: 'invalidRobotId',
    }

    await expect(attackRobot({ attacker: AttackerFightResult, target: TargetFightResult })).rejects.toThrow(
      RobotNotFoundError
    )
  })

  it('throws an error, if attacker RobotServiceId is undefined', async () => {
    await expect(
      attackRobot({ attacker: { ...AttackerFightResult, robotServiceId: '' }, target: TargetFightResult })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if attacker available health is undefined', async () => {
    await expect(
      attackRobot({
        attacker: { ...AttackerFightResult, availableHealth: undefined as unknown as number },
        target: TargetFightResult,
      })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if attacker available energy is undefined', async () => {
    await expect(
      attackRobot({
        attacker: { ...AttackerFightResult, availableEnergy: undefined as unknown as number },
        target: TargetFightResult,
      })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if attacker alive is undefined', async () => {
    await expect(
      attackRobot({
        attacker: { ...AttackerFightResult, alive: undefined as unknown as boolean },
        target: TargetFightResult,
      })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if target RobotServiceId is undefined', async () => {
    await expect(
      attackRobot({ attacker: AttackerFightResult, target: { ...TargetFightResult, robotServiceId: '' } })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if target available health is undefined', async () => {
    await expect(
      attackRobot({
        attacker: AttackerFightResult,
        target: { ...TargetFightResult, availableHealth: undefined as unknown as number },
      })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if target available energy is undefined', async () => {
    await expect(
      attackRobot({
        attacker: AttackerFightResult,
        target: { ...TargetFightResult, availableEnergy: undefined as unknown as number },
      })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if target alive is undefined', async () => {
    await expect(
      attackRobot({
        attacker: AttackerFightResult,
        target: { ...TargetFightResult, alive: undefined as unknown as boolean },
      })
    ).rejects.toThrow(RobotInvalidArgumentError)
  })
})
