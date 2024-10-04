import axios from 'axios'
import { GameCommand } from './commands'
import { getPlayer } from './config'

export async function sendCommand<T extends GameCommand>(command: Omit<T, 'playerId'>): Promise<void> {
  const playerId = getPlayer().playerId
  await axios.post('/commands', {
    playerId: playerId,
    type: command.type,
    data: { ...command.data },
  })
}
