import eventBus from '../../../../../event-handling/event-bus'
import { Event, EventContext, EventType } from '../../../../../event-handling/events'
import { FullRobot } from '../../../../../event-handling/robot/robot.types'
import logger from '../../../../../utils/logger'
import { InventoryData } from '../../../../trading/inventory/domain/model/inventory'
import inventoryService from '../../../../trading/inventory/domain/use-cases'
import { RobotData } from '../../../domain/models/robot'
import robotService, { getRobot } from '../../../domain/use-cases'
import { RobotFightResult } from '../../../domain/use-cases/data-access'

export default function setUpRobotEventListeners() {
  eventBus.subscribe('RobotSpawned', async ({ event }: EventContext<'RobotSpawned'>) => {

    try {
      const { robotData, inventoryData } = mapFullRobotToRobot({ robot: event.payload.robot })
      const inventory = await inventoryService.createInventory({ inventoryData })
      logger.info({ robot: robotData.robotServiceId, planet: robotData.currentPlanet }, 'New Robots 🤖 spawned')
      robotService.createRobot({ robotData: { ...robotData, inventoryId: inventory.id } })
    } catch (error) {
      handeError(event, error)
    }
  })

  eventBus.subscribe('RobotAttacked', async ({ event }: EventContext<'RobotAttacked'>) => {
    const { attacker, target } = event.payload
    logger.info({ attacker, target }, 'Robot has been attacked ⚔️')

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
      await robotService.attackRobot({ attacker: mappedAttacker, target: mappedTarget })
    } catch (error) {
      handeError(event, error)
    }
  })

  eventBus.subscribe('RobotMoved', async ({ event }: EventContext<'RobotMoved'>) => {
    const { robotId, remainingEnergy, fromPlanet, toPlanet } = event.payload
    logger.info({ robotId, fromPlanet, toPlanet, remainingEnergy }, 'Robot has been moved 🚶‍♂️')

    const robot = await getRobot({ queryParams: { robotServiceId: robotId } })
    if (!robot) {
      logger.error({ robot }, 'Robot to move does not exist')
      throw new Error()
    }

    if (robot?.currentPlanet != fromPlanet.id) {
      logger.error({ robot, fromPlanet }, 'The planet to move from does not equal the current planet')
      throw new Error('Planet to move from is invalid')
    }

    try {
      await robotService.moveRobot({
        robotServiceId: robotId,
        planetToMove: toPlanet.id,
        movementDifficulty: toPlanet.movementDifficulty,
      })
    } catch (error) {
      handeError(event, error)
    }
    logger.info({ fromPlanet, toPlanet }, 'PLANETS')
  })

  eventBus.subscribe('RobotRegenerated', async ({ event }: EventContext<'RobotRegenerated'>) => {
    const { robotId, availableEnergy } = event.payload
    logger.info({ robotId, availableEnergy }, 'Robot has regenerated 🤕')
    try {
      await robotService.regenerateRobot({ robotServiceId: robotId, availableEnergy })
    } catch (error) {
      handeError(event, error)
    }
  })

  eventBus.subscribe('RobotResourceMined', ({ event }: EventContext<'RobotResourceMined'>) => {
    const { robotId, minedResource, minedAmount, resourceInventory } = event.payload
    logger.info({ robot: robotId, minedResource, minedAmount, resourceInventory }, 'Robot 🤖 has mined resource ⛏️')

    try {
      robotService.mineResource({ robotServiceId: robotId, minedResource, minedAmount })
    } catch (error) {
      handeError(event, error)
    }
  })

  eventBus.subscribe('RobotResourceRemoved', ({ event }: EventContext<'RobotResourceRemoved'>) => {
    const { robotId, removedResource, removedAmount, resourceInventory } = event.payload
    logger.info({ robotId, removedResource, removedAmount, resourceInventory }, 'Resource has been removed from robot 👜')

    try {
      robotService.removeResource({ robotServiceId: robotId, resource: removedResource, amount: removedAmount })
    } catch (error) {
      handeError(event, error)
    }
  })

  eventBus.subscribe('RobotRestoredAttributes', ({ event }: EventContext<'RobotRestoredAttributes'>) => {
    const { robotId, restorationType, availableEnergy, availableHealth } = event.payload
    logger.info({ robotId, restorationType, availableEnergy, availableHealth }, 'Robot attributs have been restored ⚡❤️‍🩹')

    try {
      robotService.restoreAttributes({ robotServiceId: robotId, restorationType, availableEnergy, availableHealth })
    } catch (error) {
      handeError(event, error)
    }
  })

  eventBus.subscribe('RobotUpgraded', ({ event }: EventContext<'RobotUpgraded'>) => {
    const { robotId, robot, level, upgrade } = event.payload
    logger.info({ robotId, level, upgrade, robot }, 'Robot has got an update 🤖⏫')
    try {
      robotService.upgradeRobot({ robotServiceId: robotId, level, upgrade })
    } catch (error) {
      handeError(event, error)
    }
  })

}

function mapFullRobotToRobot({ robot }: { robot: FullRobot }) {
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

  const inventoryData: InventoryData = {
    maxStorage: robot.inventory.maxStorage,
    storageLevel: robot.inventory.storageLevel,
    storage: {
      COAL,
      GEM,
      GOLD,
      IRON,
      PLATIN,
    },
  }

  const robotData: RobotData = {
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

  return { robotData, inventoryData }
}

function handeError<T extends EventType>(event: Event<T>, error: unknown) {
  logger.error({ event, error }, `An error ocurred while processing event ${event.header.type}`)
  process.exit()
}
