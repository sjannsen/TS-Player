import { RobotData } from '../../robot/domain/models/robot'
import { RobotLevels } from '../../robot/domain/models/types'
import makeBuyMiningLevelUpgrade from './buy-mining-level-upgrade'

describe('buyMiningLevelUpgrade', () => {
  const mockBuyUpgrade = jest.fn()
  let mockItemService = { findByName: jest.fn() }
  let mockBankAccountService = { getBalance: jest.fn() }
  const mockRobot: Partial<RobotData> = {
    id: 'mockId',
    robotServiceId: 'mockRobotId',
    currentPlanet: 'mockPlanetId',
    levels: {
      miningLevel: 0,
    } as RobotLevels,
  }

  beforeEach(() => jest.clearAllMocks())
  it('should return false and not call buyUpgrade if balance is too low', async () => {
    mockItemService = {
      findByName: jest.fn().mockResolvedValueOnce({
        type: 'UPGRADE',
        name: 'MINING_1',
        price: 150,
      }),
    }
    mockBankAccountService = { getBalance: jest.fn().mockImplementationOnce(() => 100) }
    const buyMiningLevelUpgrade = makeBuyMiningLevelUpgrade({
      buyUpgrade: mockBuyUpgrade,
      bankAccountService: mockBankAccountService,
      itemService: mockItemService,
    })

    await buyMiningLevelUpgrade({ robot: mockRobot as RobotData })

    expect(mockItemService.findByName).toHaveBeenCalledTimes(1)
    expect(mockItemService.findByName).toHaveBeenCalledWith({ name: 'MINING_1' })
    expect(mockBankAccountService.getBalance).toHaveBeenCalledTimes(1)
    expect(mockBuyUpgrade).toHaveBeenCalledTimes(0)
  })

  it('should return true and call buyUpgrade if balance is sufficient', async () => {
    mockItemService = {
      findByName: jest.fn().mockResolvedValueOnce({
        type: 'UPGRADE',
        name: 'MINING_1',
        price: 150,
      }),
    }
    mockBankAccountService = { getBalance: jest.fn().mockImplementationOnce(() => 200) }
    const buyMiningLevelUpgrade = makeBuyMiningLevelUpgrade({
      buyUpgrade: mockBuyUpgrade,
      bankAccountService: mockBankAccountService,
      itemService: mockItemService,
    })

    await buyMiningLevelUpgrade({ robot: mockRobot as RobotData })

    expect(mockItemService.findByName).toHaveBeenCalledTimes(1)
    expect(mockItemService.findByName).toHaveBeenCalledWith({ name: 'MINING_1' })
    expect(mockBankAccountService.getBalance).toHaveBeenCalledTimes(1)
    expect(mockBuyUpgrade).toHaveBeenCalledTimes(1)
  })
})
