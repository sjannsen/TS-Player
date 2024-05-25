import { SellTradablesCommandData, SellTradablesCommand } from '../../../../../shared/commands'
import { sendCommand } from '../../../../../shared/sendCommand'

export async function sellRessources({ robotId }: SellTradablesCommandData) {
  return sendCommand<SellTradablesCommand>({ type: 'selling', data: { robotId } })
}
