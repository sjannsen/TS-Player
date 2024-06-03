import { buyRobots } from './buyRobots'
import { engangeBattle } from './engangeBattle'
import { mineResources } from './mineResources'
import { moveRobot } from './moveRobot'

const robotCommandService = {
  buyRobots,
  engangeBattle,
  mineResources,
  moveRobot,
}

export default robotCommandService
export { buyRobots, engangeBattle, mineResources, moveRobot }
