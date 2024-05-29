import { BattleCommandData, BattleCommand } from '../../../../shared/commands'
import { sendCommand } from '../../../../shared/sendCommand'

export async function engangeBattle({ robotId, targetId }: BattleCommandData) {
  return sendCommand<BattleCommand>({ type: 'battle', data: { robotId, targetId } })
}
