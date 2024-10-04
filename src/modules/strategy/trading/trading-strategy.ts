import logger from '../../../utils/logger'
import { getCurrentRoundNumber } from '../../game/roundStatus'
import { buyRobots } from '../../robot/adapters/output/commands'

export default async function getTradingStrategy() {
  const roundNumber = getCurrentRoundNumber()
  if (roundNumber === 2) getFirstRoundStrategy()
}

async function getFirstRoundStrategy() {
  try {
    await buyRobots(5)
    logger.info('Bought initial robots 🤖🔪')
  } catch (error) {
    logger.error({ error }, 'An error ocurred while buying robots')
  }
}
