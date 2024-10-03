import { RobotData } from '../../robot/domain/models/robot'
import makeGetSellingStrategy from './selling-strategy'

describe('getSellingStrategy', () => {
  const mockSellResources = jest.fn()
  const mockRobot: Partial<RobotData> = {
    robotServiceId: 'mockRobotId',
    currentPlanet: 'mockPlanetId',
    inventoryId: 'inventoryId',
  }

  beforeEach(() => jest.clearAllMocks())

  it('should return false and not call sellResources if inventory of given robot is not full', async () => {
    const mockInventoryService = { getInventoryCapacity: jest.fn().mockReturnValueOnce({ freeCapacity: 10 })}
    const getSellingStrategy = makeGetSellingStrategy({
        inventoryService: mockInventoryService,
        sellResources: mockSellResources,
      })
    const actionTaken = await getSellingStrategy({ robot: mockRobot as RobotData })

    expect(mockSellResources).toHaveBeenCalledTimes(0)
    expect(actionTaken).toBeFalsy()
  })

  it('should return true and call sellResources if inventory of given robot is full', async () => {
    const mockInventoryService = { getInventoryCapacity: jest.fn().mockReturnValueOnce({ freeCapacity: 0 })}
    const getSellingStrategy = makeGetSellingStrategy({
        inventoryService: mockInventoryService,
        sellResources: mockSellResources,
      })

    const actionTaken = await getSellingStrategy({ robot: mockRobot as RobotData })

    expect(mockSellResources).toHaveBeenCalledTimes(1)
    expect(actionTaken).toBeTruthy()
  })
})
