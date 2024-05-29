import { buyRobots } from './buyRobots'
import { engangeBattle } from './engangeBattle'
import { mineRessources } from './mineRessources'
import { moveRobots } from './moveRobots'

const robotCommandService = {
  buyRobots,
  engangeBattle,
  mineRessources,
  moveRobots,
}

export default robotCommandService
export { buyRobots, engangeBattle, mineRessources, moveRobots }
