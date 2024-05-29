import { Robot, MakeRobotProps } from '../models/robot'

export default function extractRobotProps({ robot }: { robot: Robot }): MakeRobotProps {
  const inventory = robot.getInventory()
  return {
    id: robot.getId(),
    robotServiceId: robot.getRobotServiceId(),
    alive: robot.isAlive(),
    player: robot.getPlayer(),
    attributes: robot.getAttributes(),
    levels: robot.getLevels(),
    inventory: {
      storageLevel: inventory.getStorageLevel(),
      maxStorage: inventory.getMaxStorage(),
      storage: inventory.getStorage(),
    },
    currentPlanet: robot.getCurrentPlanet(),
  }
}
