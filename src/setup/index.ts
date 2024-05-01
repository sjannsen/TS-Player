import getAvailableGames from './getAvailableGames'
import getOrRegisterPlayer from './getOrRegisterPlayer'
import getPlayer from './getPlayer'
import joinGame from './joinGame'
import joinNextAvailableGame from './joinNextAvailableGame'
import registerPlayer from './registerPlayer'

const setUpPlayer = async (name: string, email: string) => await getOrRegisterPlayer({ name, email, registerPlayer })

const joinNextGameAvailable = async () => await joinNextAvailableGame({ getAvailableGames, getPlayer, joinGame })

const setUpService = Object.freeze({
  getAvailableGames,
  setUpPlayer,
  joinNextGameAvailable,
})

export default setUpService
export { getAvailableGames, joinNextGameAvailable, setUpPlayer }
