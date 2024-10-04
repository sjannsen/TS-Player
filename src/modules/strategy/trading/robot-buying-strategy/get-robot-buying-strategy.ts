import logger from '../../../../utils/logger'
import { RobotData } from '../../../robot/domain/models/robot'
import { ItemData } from '../../../trading/item/domain/model/item'

type GetRobotBuyingStrategyDependencies = {
  bankAccountService: { getBalance: () => number }
  itemService: { findByName: ({ itemName }: { itemName: string }) => Promise<ItemData | null> }
  robotService: { listRobots: () => Promise<RobotData[]> }
  buyRobots: (amount: number) => Promise<void>
}

const ROBOT_LIMIT = 100

export default function makeGetRobotBuyingStrategy({
  bankAccountService,
  itemService,
  robotService,
  buyRobots
}: GetRobotBuyingStrategyDependencies) {
  return async function getRobotBuyingStrategy() {
    const currentBalance = bankAccountService.getBalance()
    const robotItem = await itemService.findByName({ itemName: 'ROBOT' })
    const miningUpgrade = await itemService.findByName({ itemName: 'MINING_3' })

    if (!robotItem) {
      logger.error({ robotPrice: robotItem, currentBalance }, 'Robot Item is undefined 🤖🛑')
      throw new Error('Robot item undefined 🤖🛑')
    }

    if (!miningUpgrade) {
      logger.error({ miningUpgrade, currentBalance }, 'MiningUpgrade Item is undefined ⛏️🛑')
      throw new Error('MiningUpgrade item undefined ⛏️🛑')
    }

    const robotCount = (await robotService.listRobots()).length
    const canBuyMiningUpgrade = currentBalance <= miningUpgrade.price + 1
    if (ROBOT_LIMIT <= robotCount || canBuyMiningUpgrade) return

    const robotPrice = robotItem.price
    const spendingLimit = currentBalance * 0.5
    const buyableAmount = Math.floor(spendingLimit / robotPrice)

    if (buyableAmount > 0) {
      logger.error(`Going to buy ${buyableAmount} Robots 🤖`)
      await buyRobots(buyableAmount)
    }
  }
}
