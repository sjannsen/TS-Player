import logger from "../../../utils/logger"
import { buyRobots } from "../../robot/adapters/output/commands"
import robotService from "../../robot/domain/use-cases"
import bankAccountService from "../../trading/bank-account/domain/use-cases"
import itemService from "../../trading/item/domain/use-cases"

const ROBOT_LIMIT = 100

export default async function getRobotBuyingStrategy() {
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
