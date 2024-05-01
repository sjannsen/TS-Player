import { getAvailableGames } from '../setup'
import clear from './clear'
import createGame from './createGame'
import endGame from './endGame'
import initializeGame from './initializeGame'
import setRoundDuration from './setRoundDuration'
import startGame from './startGame'

const clearSetUp = async () => await clear({ getAvailableGames, endGame })

const setUpGame = async () =>
  await initializeGame({ createGame, getAvailableGames, setRoundDuration, clearStartedGames: clearSetUp })

const setUpService = Object.freeze({
  clearSetUp,
  setUpGame,
  endGame,
  startGame,
})

export default setUpService
export { clearSetUp, setUpGame, endGame, startGame }
