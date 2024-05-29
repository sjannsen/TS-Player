import makeListRobots from './list-robots'
import { mockRobot, mockRobotDb } from './mocks/mock'

describe('listRobot', () => {
  const listRobots = makeListRobots({ robotDb: mockRobotDb })

  it('returns all robots', () => {
    const robots = listRobots()

    expect(robots.length).toBe(2)
    expect(robots[0]).toEqual(mockRobot)
    expect(robots[1]).toEqual(mockRobot)
  })
})
