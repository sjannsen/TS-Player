import { getCurrentGameId, setUpCurrentGameHandler } from './current-game'
import setUpGameEndListener from './end-game'
import { getCurrentRoundId, getCurrentRoundNumber, setUpRoundStatusStateHandler } from './roundStatus'

const gameStatusService = Object.freeze({
  getCurrentRoundNumber,
  getCurrentRoundId,
  getCurrentGameId,
})

const setUpGameStateHandlers = () => {
  setUpRoundStatusStateHandler()
  setUpCurrentGameHandler()
  setUpGameEndListener()
}

export default gameStatusService
export { gameStatusService, setUpGameStateHandlers, getCurrentGameId }
