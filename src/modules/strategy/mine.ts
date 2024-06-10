import { MineCommand } from '../../shared/commands'
import { sendCommand } from '../../shared/sendCommand'
import logger from '../../utils/logger'
import { getPlanets } from '../map/domain/use-cases'
import { listRobots } from '../robot/domain/use-cases'

async function getRobotsThatCanMine() {
  const robots = await listRobots()
  const planetData = await getPlanets()
  const planets = planetData.filter((p) => {
    const resource = p.resource
    return resource && resource.currentAmount > 0
  })

  const robotsThatCanMine: string[] = []
  planets.forEach((planet) => {
    const robot = robots.find((robot) => robot.currentPlanet == planet.mapServiceId)
    if (robot) robotsThatCanMine.push(robot.robotServiceId)
  })

  return robotsThatCanMine
}

async function mine() {
  const robots = await getRobotsThatCanMine()
  logger.info({ robots: robots }, 'Mining with:')

  if (robots.length == 0) return
  logger.warn({ robot: robots[0] }, 'sending mine command for')
  sendCommand<MineCommand>({ type: 'mining', data: { robotId: robots[0] } })
}

export { mine }
