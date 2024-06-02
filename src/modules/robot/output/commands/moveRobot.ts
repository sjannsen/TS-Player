import { MoveCommandData, MoveCommand } from '../../../../shared/commands'
import { sendCommand } from '../../../../shared/sendCommand'

export async function moveRobot({ robotId, planetId }: MoveCommandData) {
  return sendCommand<MoveCommand>({ type: 'movement', data: { robotId, planetId } })
}
