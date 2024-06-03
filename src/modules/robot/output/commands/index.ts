import { buyRobots } from './buyRobots'
import { engangeBattle } from './engangeBattle'
import { mineRessources } from './mineRessources'
import { moveRobot } from './moveRobot'

const robotCommandService = {
  buyRobots,
  engangeBattle,
  mineRessources,
  moveRobot,
}

export default robotCommandService
export { buyRobots, engangeBattle, mineRessources, moveRobot }
