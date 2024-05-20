import { getCurrentRoundId, getCurrentRoundNumber, setUpRoundStatusStateHandler } from './roundStatus'

const gameStatusService = {
  getCurrentRoundNumber,
  getCurrentRoundId,
}

const setUpGameStateHandlers = () => {
  setUpRoundStatusStateHandler()
}

export default gameStatusService
export { gameStatusService, setUpGameStateHandlers }
