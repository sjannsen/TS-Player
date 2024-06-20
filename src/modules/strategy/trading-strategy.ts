import logger from '../../utils/logger'
import { buyRobots } from '../robot/adapters/output/commands'

export default async function getTradingStrategy(roundNumber: number) {
  if (roundNumber === 2) getFirstRoundStrategy()
}

async function getFirstRoundStrategy() {
  try {
    await buyRobots(5)
    logger.info('Bought robots')
  } catch (error) {
    logger.error({ error }, 'An error ocurred while buying robots')
  }
}
