import { SellTradablesCommandData, SellTradablesCommand } from '../../../../../../shared/commands'
import { sendCommand } from '../../../../../../shared/sendCommand'

export async function sellRessources({ robotId, planetId }: SellTradablesCommandData) {
  return sendCommand<SellTradablesCommand>({ type: 'selling', data: { robotId, planetId } })
}
