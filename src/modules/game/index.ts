import { getCurrentGameId } from './current-game'
import { getCurrentRoundId, getCurrentRoundNumber, setUpRoundStatusStateHandler } from './roundStatus'

const gameStatusService = Object.freeze({
  getCurrentRoundNumber,
  getCurrentRoundId,
  getCurrentGameId,
})

const setUpGameStateHandlers = () => {
  setUpRoundStatusStateHandler()
  setUpGameStateHandlers()
}

export default gameStatusService
export { gameStatusService, setUpGameStateHandlers, getCurrentGameId }
