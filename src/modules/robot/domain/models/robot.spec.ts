import makeRobot from '.'
import Id from '../Id'
import { RobotInvalidArgumentError } from './robot.errors'
import { RobotAttributes, RobotLevels } from './types'

const props = {
  robotServiceId: 'robotId',
  player: 'player',
  alive: true,
  attributes: {
    maxHealth: 1,
    maxEnergy: 1,
    energyRegen: 1,
    attackDamage: 1,
    miningSpeed: 1,
    health: 1,
    energy: 1,
  },
  levels: {
    healthLevel: 1,
    damageLevel: 1,
    miningSpeedLevel: 1,
    miningLevel: 1,
    energyLevel: 1,
    energyRegenLevel: 1,
    storageLevel: 1,
  },
  currentPlanet: 'planetId',
}

describe('makeRobot', () => {
  it('creates a robot without id', () => {
    const robot = makeRobot({ ...props })

    expect(Id.isValidId(robot.getId())).toBe(true)
    expect(robot.getRobotServiceId()).toBe(props.robotServiceId)
    expect(robot.getPlayer()).toBe(props.player)
    expect(robot.isAlive()).toBe(props.alive)
    expect(robot.getAttributes()).toEqual(props.attributes)
    expect(robot.getLevels()).toEqual(props.levels)
  })

  it('create a robot with id', () => {
    const id = Id.makeId()
    const robot = makeRobot({ ...props, id })

    expect(robot.getId()).toBe(id)
    expect(Id.isValidId(robot.getId())).toBe(true)
    expect(robot.getRobotServiceId()).toBe(props.robotServiceId)
    expect(robot.getPlayer()).toBe(props.player)
    expect(robot.isAlive()).toBe(props.alive)
    expect(robot.getAttributes()).toEqual(props.attributes)
    expect(robot.getLevels()).toEqual(props.levels)
  })

  it('throws an error, if the given id is invalid', () => {
    expect(() => makeRobot({ ...props, id: 'invalidId' })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the robotServiceId is missing', () => {
    expect(() => makeRobot({ ...props, robotServiceId: '' })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the player is missing', () => {
    expect(() => makeRobot({ ...props, player: '' })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if the current planet is missing', () => {
    expect(() => makeRobot({ ...props, currentPlanet: '' })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if any attribute is negative', () => {
    const invalidAttributes: RobotAttributes = { attackDamage: -10 } as RobotAttributes
    expect(() => makeRobot({ ...props, attributes: invalidAttributes })).toThrow(RobotInvalidArgumentError)
  })

  it('throws an error, if any level is negativ', () => {
    const invalidLevels: RobotLevels = { damageLevel: -10 } as RobotLevels
    expect(() => makeRobot({ ...props, levels: invalidLevels })).toThrow(RobotInvalidArgumentError)
  })
})
