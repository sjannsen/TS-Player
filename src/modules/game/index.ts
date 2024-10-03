import { getCurrentGameId, setUpCurrentGameHandler } from './current-game'
import setUpGameEndListener from './end-game'
import setUpGameCreatedHandler from './game-created'
import { getCurrentRoundId, getCurrentRoundNumber, setUpRoundStatusStateHandler } from './roundStatus'

const gameStatusService = Object.freeze({
  getCurrentRoundNumber,
  getCurrentRoundId,
  getCurrentGameId,
})

const setUpGameStateHandlers = () => {
  setUpGameCreatedHandler()
  setUpRoundStatusStateHandler()
  setUpCurrentGameHandler()
  setUpGameEndListener()
}

export default gameStatusService
export { gameStatusService, setUpGameStateHandlers, getCurrentGameId }
