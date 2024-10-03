import { AxiosError, isAxiosError } from 'axios'
import { BuyUpgradeCommandData } from '../../../shared/commands'
import logger from '../../../utils/logger'
import { RobotData } from '../../robot/domain/models/robot'
import { ItemData } from '../../trading/item/domain/model/item'

const miningLevels: { [key: number]: string } = {
  1: 'MINING_1',
  2: 'MINING_2',
  3: 'MINING_3',
  4: 'MINING_4',
  5: 'MINING_5',
}

type BuyMiningLevelUpgrade = {
  robot: RobotData
  buyUpgrade: ({ robotId, planetId, itemName, itemQuantity }: BuyUpgradeCommandData) => Promise<void>
  bankAccountService: { getBalance: () => number }
  itemService: { findByName: ({ name }: { name: string }) => Promise<ItemData | null> }
}

export default async function makeBuyMiningLevelUpgrade({ robot, buyUpgrade, bankAccountService, itemService }: BuyMiningLevelUpgrade) {
  const currentMiningLevel = robot.levels.miningLevel
  const nextMiningUpgrade = miningLevels[currentMiningLevel + 1]
  const currentBalance = bankAccountService.getBalance()
  const PRICE_UNDEFINED_MESSAGE = `Can not upgrade mining level of 🤖: ${robot.robotServiceId}. No price could be found for the upgrade: ${nextMiningUpgrade}`

  const { price: upgradePrice } = (await itemService.findByName({ name: nextMiningUpgrade })) ?? {}
  if (!upgradePrice) throw new Error(PRICE_UNDEFINED_MESSAGE)

  if (currentBalance < upgradePrice) {
    const BALANCE_TOO_LOW_MESSAGE = `Can not buy upgrade: ${nextMiningUpgrade} for robot: ${robot.robotServiceId} 💰🙄, the current balance is too low: ${currentBalance} < ${upgradePrice}`

    logger.warn(BALANCE_TOO_LOW_MESSAGE)
    return false
  }

  try {
    await buyUpgrade({
      robotId: robot.robotServiceId,
      planetId: robot.currentPlanet,
      itemName: nextMiningUpgrade,
      itemQuantity: 1,
    })
  } catch (error) {
    if (isAxiosError(error)) error as AxiosError
    logger.error({ error }, 'Error while buying upgrade')
    throw error
  }
}
