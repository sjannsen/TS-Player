import { MineCommandData, MineCommand } from '../../../../shared/commands'
import { sendCommand } from '../../../../shared/sendCommand'

export async function mineRessources({ robotId }: MineCommandData) {
  return sendCommand<MineCommand>({ type: 'mining', data: { robotId } })
}
