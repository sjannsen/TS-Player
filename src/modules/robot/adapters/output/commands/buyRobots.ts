import { BuyTradableCommand } from '../../../../../shared/commands'
import { sendCommand } from '../../../../../shared/sendCommand'

export async function buyRobots(amount: number) {
  return sendCommand<BuyTradableCommand>({
    type: 'buying',
    data: { robotId: null, itemName: 'ROBOT', itemQuantity: amount },
  })
}
