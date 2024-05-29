import makeRobot from '.'
import Id from '../Id'
import { RobotInvalidArgumentError } from './robot.errors'

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
  },
  inventory: {
    storageLevel: 1,
    maxStorage: 10,
    storage: {
      COAL: 1,
      IRON: 1,
      GEM: 1,
      GOLD: 1,
      PLATIN: 1,
    },
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
    expect(robot.getInventory().getMaxStorage()).toEqual(props.inventory.maxStorage)
    expect(robot.getInventory().getStorageLevel()).toEqual(props.inventory.storageLevel)
    expect(robot.getInventory().getStorage()).toEqual(props.inventory.storage)
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
    expect(robot.getInventory().getMaxStorage()).toEqual(props.inventory.maxStorage)
    expect(robot.getInventory().getStorageLevel()).toEqual(props.inventory.storageLevel)
    expect(robot.getInventory().getStorage()).toEqual(props.inventory.storage)
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

  it('throws an error, if any storage entry is negativ', () => {
    const invalidStorage: InventoryResources = { COAL: -10 } as InventoryResources
    const invalidInventory = {
      inventory: {
        storageLevel: 1,
        maxStorage: 1,
        storage: invalidStorage,
      },
    }
    expect(() => makeRobot({ ...props, ...invalidInventory })).toThrow(RobotInvalidArgumentError)
  })
})

describe('robot inventory', () => {
  it('knows, when it is full', () => {
    const robot = makeRobot({ ...props })
    expect(robot.getInventory().isFull()).toBe(false)
  })

  it('knows, when it is not full', () => {
    const fullStorage: InventoryResources = { COAL: 5 } as InventoryResources
    const fullInventory = {
      inventory: {
        storageLevel: 1,
        maxStorage: 5,
        storage: fullStorage,
      },
    }
    const robot = makeRobot({ ...props, ...fullInventory })
    expect(robot.getInventory().isFull()).toBe(true)
  })

  it('returns the free capacity when not full', () => {
    const fullStorage: InventoryResources = { COAL: 3 } as InventoryResources
    const fullInventory = {
      inventory: {
        storageLevel: 1,
        maxStorage: 5,
        storage: fullStorage,
      },
    }
    const robot = makeRobot({ ...props, ...fullInventory })
    expect(robot.getInventory().getFreeCapacity()).toBe(2)
  })

  it('returns the free capacity when full', () => {
    const fullStorage: InventoryResources = { COAL: 5 } as InventoryResources
    const fullInventory = {
      inventory: {
        storageLevel: 1,
        maxStorage: 5,
        storage: fullStorage,
      },
    }
    const robot = makeRobot({ ...props, ...fullInventory })
    expect(robot.getInventory().getFreeCapacity()).toBe(0)
  })
})
