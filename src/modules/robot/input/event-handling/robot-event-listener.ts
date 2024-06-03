import eventBus from '../../../../event-handling/event-bus'
import { Event, EventContext, EventType } from '../../../../event-handling/events'
import { FullRobot } from '../../../../event-handling/robot/robot.types'
import logger from '../../../../utils/logger'
import { MakeRobotProps } from '../../domain/models/robot'
import robotService, { getRobot } from '../../domain/use-cases'
import { RobotFightResult } from '../../domain/use-cases/types'

export default function setUpRobotEventListeners() {
  eventBus.subscribe('RobotSpawned', ({ event }: EventContext<'RobotSpawned'>) => {
    logger.info({ payload: event.payload }, 'ROBOTS SPAWNED')

    try {
      const makeRobotProps = mapFullRobotToRobot(event.payload.robot)
      robotService.createRobot({ robot: makeRobotProps })
    } catch (error) {
      handeError(event, error)
    }
  })

  eventBus.subscribe('RobotAttacked', ({ event }: EventContext<'RobotAttacked'>) => {
    logger.info({ payload: event.payload }, 'RobotAttacked')
    const { attacker, target } = event.payload

    const mappedAttacker: RobotFightResult = {
      robotServiceId: attacker.robotId,
      alive: attacker.alive,
      availableEnergy: attacker.availableEnergy,
      availableHealth: attacker.availableHealth,
    }

    const mappedTarget: RobotFightResult = {
      robotServiceId: target.robotId,
      alive: target.alive,
      availableEnergy: target.availableEnergy,
      availableHealth: target.availableHealth,
    }

    try {
      robotService.attackRobot({ attacker: mappedAttacker, target: mappedTarget })
    } catch (error) {
      handeError(event, error)
    }
  })

  eventBus.subscribe('RobotMoved', ({ event }: EventContext<'RobotMoved'>) => {
    logger.info({ payload: event.payload }, 'RobotMoved')
    const { robotId, remainingEnergy, fromPlanet, toPlanet } = event.payload

    const robot = getRobot({ queryParams: { robotServiceId: robotId } })
    if (!robot) {
      logger.error({ robot }, 'Robot to move does not exist')
      throw new Error()
    }

    if (robot?.getCurrentPlanet() != fromPlanet.id) {
      logger.error({ robot, fromPlanet }, 'The planet to move from does not equal the current planet')
      throw new Error('Planet to move from is invalid')
    }

    try {
      robotService.moveRobot({
        robotServiceId: robotId,
        planetToMove: toPlanet.id,
        movementDifficulty: toPlanet.movementDifficulty,
      })
    } catch (error) {
      handeError(event, error)
    }
    logger.info({ fromPlanet, toPlanet }, 'PLANETS')
  })

  eventBus.subscribe('RobotRegenerated', ({ event }: EventContext<'RobotRegenerated'>) => {
    logger.info({ payload: event.payload }, 'RobotRegenerated')
    const { robotId, availableEnergy } = event.payload
    try {
      robotService.regenerateRobot({ robotServiceId: robotId, availableEnergy })
    } catch (error) {
      handeError(event, error)
    }
  })

  eventBus.subscribe('RobotResourceMined', ({ event }: EventContext<'RobotResourceMined'>) => {
    logger.info({ payload: event.payload }, 'RobotResourceMined')
    const { robotId, minedResource, minedAmount, resourceInventory } = event.payload

    try {
      robotService.mineResource({ robotServiceId: robotId, minedResource, minedAmount })
    } catch (error) {
      handeError(event, error)
    }
  })

  eventBus.subscribe('RobotResourceRemoved', ({ event }: EventContext<'RobotResourceRemoved'>) => {
    logger.info({ payload: event.payload }, 'RobotResourceRemoved')
    const { robotId, removedResource, removedAmount, resourceInventory } = event.payload

    try {
      robotService.removeResource({ robotServiceId: robotId, resource: removedResource, amount: removedAmount })
    } catch (error) {
      handeError(event, error)
    }
  })

  eventBus.subscribe('RobotRestoredAttributes', ({ event }: EventContext<'RobotRestoredAttributes'>) => {
    logger.info({ payload: event.payload }, 'RobotRestoredAttributes')
    const { robotId, restorationType, availableEnergy, availableHealth } = event.payload

    try {
      robotService.restoreAttributes({ robotServiceId: robotId, restorationType, availableEnergy, availableHealth })
    } catch (error) {
      handeError(event, error)
    }
  })

  eventBus.subscribe('RobotUpgraded', ({ event }: EventContext<'RobotUpgraded'>) => {
    logger.info({ payload: event.payload }, 'RobotUpgraded')
    const { robotId, robot, level, upgrade } = event.payload
    try {
      robotService.upgradeRobot({ robotServiceId: robotId, level, upgrade })
    } catch (error) {
      handeError(event, error)
    }
  })

  eventBus.subscribe('RobotsRevealed', ({ event }: EventContext<'RobotsRevealed'>) => {
    // TODO: check if is own robot
  })
}

function mapFullRobotToRobot(robot: FullRobot): MakeRobotProps {
  const {
    alive,
    attackDamage,
    damageLevel,
    energy,
    energyLevel,
    energyRegen,
    energyRegenLevel,
    health,
    healthLevel,
    id,
    inventory,
    maxEnergy,
    maxHealth,
    miningLevel,
    miningSpeed,
    miningSpeedLevel,
    planet,
    player,
  } = robot

  const { COAL, GEM, GOLD, IRON, PLATIN } = inventory.resources

  const makeRobotProps: MakeRobotProps = {
    alive,
    player,
    robotServiceId: id,
    currentPlanet: planet.planetId,
    attributes: {
      attackDamage,
      energy,
      energyRegen,
      health,
      maxEnergy,
      maxHealth,
      miningSpeed,
    },
    inventory: {
      maxStorage: robot.inventory.maxStorage,
      storageLevel: robot.inventory.storageLevel,
      storage: {
        COAL,
        GEM,
        GOLD,
        IRON,
        PLATIN,
      },
    },
    levels: {
      damageLevel,
      energyLevel,
      energyRegenLevel,
      healthLevel,
      miningLevel,
      miningSpeedLevel,
      storageLevel: robot.inventory.storageLevel,
    },
  }

  return makeRobotProps
}

function handeError<T extends EventType>(event: Event<T>, error: unknown) {
  logger.error({ event, error }, `An error ocurred while processing event ${event.header.type}`)
  process.exit()
}
