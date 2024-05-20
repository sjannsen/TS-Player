import axios from 'axios'
import getPlayer from './getPlayer'
import { Player } from '../shared/types'

type GetOrRegisterPlayerProps = {
  name: string
  email: string
  registerPlayer: (name: string, email: string) => Promise<Player>
}

export default async function getOrRegisterPlayer({
  name,
  email,
  registerPlayer,
}: GetOrRegisterPlayerProps): Promise<Player> {
  try {
    const player = await getPlayer(name, email)
    return player
  } catch (error) {
    if (!axios.isAxiosError(error)) throw error
    if (error.response?.status != 404) throw error
    return registerPlayer(name, email)
  }
}
