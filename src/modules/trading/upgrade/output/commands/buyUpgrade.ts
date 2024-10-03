import { BuyUpgradeCommand, BuyUpgradeCommandData } from '../../../../../shared/commands'
import { sendCommand } from '../../../../../shared/sendCommand'

export async function buyUpgrade({ robotId, planetId, itemName, itemQuantity }: BuyUpgradeCommandData) {
  return sendCommand<BuyUpgradeCommand>({
    type: 'buying',
    data: {
      robotId,
      itemName,
      planetId,
      itemQuantity,
    },
  })
}
