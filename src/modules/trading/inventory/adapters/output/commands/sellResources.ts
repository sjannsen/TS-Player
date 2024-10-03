import { SellTradablesCommandData, SellTradablesCommand } from '../../../../../../shared/commands'
import { sendCommand } from '../../../../../../shared/sendCommand'

export async function sellResources({ robotId, planetId }: SellTradablesCommandData) {
  return sendCommand<SellTradablesCommand>({ type: 'selling', data: { robotId, planetId } })
}
