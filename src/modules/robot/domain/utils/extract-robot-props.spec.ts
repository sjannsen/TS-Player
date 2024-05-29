import Id from '../Id'
import makeRobot from '../models'
import extractRobotProps from './extract-robot-props'

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

describe('extractRobotProps', () => {
  it('extracts the props of a robot with id', () => {
    const id = Id.makeId()
    const robot = makeRobot({ id, ...props })
    const extractedProps = extractRobotProps({ robot })
    expect(extractedProps).toStrictEqual({ id, ...props })
  })

  it('extracts the props of a robot without id', () => {
    const robot = makeRobot({ ...props })
    const extractedProps = extractRobotProps({ robot })
    expect(extractedProps).toEqual(expect.objectContaining(props))
  })
})
