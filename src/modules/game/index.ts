import { getCurrentGameId, setUpCurrentGameHandler } from './current-game'
import { getCurrentRoundId, getCurrentRoundNumber, setUpRoundStatusStateHandler } from './roundStatus'

const gameStatusService = Object.freeze({
  getCurrentRoundNumber,
  getCurrentRoundId,
  getCurrentGameId,
})

const setUpGameStateHandlers = () => {
  setUpRoundStatusStateHandler()
  setUpCurrentGameHandler()
}

export default gameStatusService
export { gameStatusService, setUpGameStateHandlers, getCurrentGameId }
