// NOTE: If checking calls on mock functions,
// mocked functions need to be placed before import statements

jest.mock('../../../trading/upgrade/output/commands/buyUpgrade.ts', () => ({
  buyUpgrade: jest.fn().mockImplementation(async ({ robotId, planetId, itemName, itemQuantity }) => {
    if (robotId !== 'robot-II' || planetId !== 'planet-1' || itemName !== 'MINING_1' || itemQuantity !== 1) {
      throw new Error('From Where?')
    }
    console.log('Upgrade robot after receiving buy Upgrade command')
    eventBus.publish('RobotUpgraded', robotUpgradedEventContext)
  }),
}))

jest.mock('../../../game/current-game.ts', () => ({
  getCurrentGameId: jest.fn().mockReturnValue('i'),
  setUpCurrentGameHandler: jest.fn(),
}))

jest.mock('../../../game/roundStatus.ts', () => ({
  getCurrentRoundNumber: jest.fn().mockReturnValue(2),
  setUpRoundStatusStateHandler: jest.fn(),
}))

jest.mock('../../../robot/adapters/output/commands/moveRobot.ts', () => ({
  moveRobot: jest.fn().mockImplementation(({ robotId, planetId }) => {
    logger.error('MOVE ROBOT')
    if (robotId != 'robot-II' || planetId != 'planet-1') {
      logger.error({ robotId, planetId }, 'NO WAY')
      throw new Error('NO WAY')
    }
    eventBus.publish('RobotMoved', robotMovedEventContext)
  }),
}))

jest.mock('../../../robot/adapters/output/commands/buyRobots.ts', () => ({
  buyRobots: jest.fn(),
}))

jest.mock('axios', () => ({
  post: jest.fn(),
}))

import { initializeMongoDBConnection } from '../../../../db/mongoDB-connection'
import eventBus from '../../../../event-handling/event-bus'
import setUpEventListeners from '../../../../event-handling/setup-event-listener'
import { setUpStateHandlers } from '../../../../setup/setUpStateHandlers'
import { updatePlayerConfig } from '../../../../shared/config'
import logger from '../../../../utils/logger'
import robotService from '../../../robot/domain/use-cases'
import { events } from './setup/events-to-publish'
import { robotMovedEventContext, robotUpgradedEventContext } from './setup/robot-setup.events'

describe('integrationtest', () => {
  beforeAll(async () => {
    updatePlayerConfig({
      playerId: 'bigdaddy-6969',
      name: 'bigdaddy-6969',
      email: 'bigdaddy-6969@big.com',
      playerExchange: 'bigdaddy-6969-all',
    })
    setUpEventListeners()
    setUpStateHandlers()
    await initializeMongoDBConnection()
  })

  it('works as expected', async () => {
    await Promise.all(events)

    const robot1 = await robotService.getRobot({ queryParams: { robotServiceId: 'robot-I' } })
    const robot2 = await robotService.getRobot({ queryParams: { robotServiceId: 'robot-II' } })
    const robot3 = await robotService.getRobot({ queryParams: { robotServiceId: 'robot-III' } })

    expect(robot1?.robotServiceId).toBe('robot-I')
    expect(robot2?.robotServiceId).toBe('robot-II')
    expect(robot3?.robotServiceId).toBe('robot-III')

    expect(robot1?.currentPlanet).toBe('planet-2')
    expect(robot2?.currentPlanet).toBe('planet-1')
    expect(robot3?.currentPlanet).toBe('planet-4')

    expect(robot1?.levels.miningLevel).toBe(0)
    expect(robot2?.levels.miningLevel).toBe(0)
    expect(robot3?.levels.miningLevel).toBe(0)
  }, 15000)
})
