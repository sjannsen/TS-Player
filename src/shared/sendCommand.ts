import axios from 'axios'
import { getPlayer } from './config'
import { GameCommand } from './commands'
import logger from '../utils/logger'

export async function sendCommand<T extends GameCommand>(command: Omit<T, 'playerId'>): Promise<void> {
  const playerId = getPlayer().playerId

  logger.info(command, 'Gonna send command')
  logger.info(playerId, 'PlayerId')

  await axios.post('/commands', {
    playerId: playerId,
    type: command.type,
    data: { ...command.data },
  })
}
