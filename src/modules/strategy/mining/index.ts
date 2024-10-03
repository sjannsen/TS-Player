import { RobotData } from '../../robot/domain/models/robot'
import bankAccountService from '../../trading/bank-account/domain/use-cases'
import itemService from '../../trading/item/domain/use-cases'
import { buyUpgrade } from '../../trading/upgrade/output/commands/buyUpgrade'
import makeBuyMiningLevelUpgrade from './buy-mining-level-upgrade'

const buyMiningLevelUpgrade = ({ robot }: { robot: RobotData }) =>
  makeBuyMiningLevelUpgrade({
    robot,
    buyUpgrade: buyUpgrade,
    bankAccountService: bankAccountService,
    itemService: itemService,
  })

export { buyMiningLevelUpgrade }
