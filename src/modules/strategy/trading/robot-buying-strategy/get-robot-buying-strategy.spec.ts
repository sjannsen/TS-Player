import makeGetRobotBuyingStrategy from "./get-robot-buying-strategy"

describe('getRobotBuyingStrategy', () => {
    const mockBankAccountService = { getBalance: jest.fn() }
    const mockItemService = { findByName: jest.fn() }
    const mockRobotService = { listRobots: jest.fn() }
    const mockBuyRobots = jest.fn()
    const getRobotBuyingStrategy = makeGetRobotBuyingStrategy({
        bankAccountService: mockBankAccountService,
        itemService: mockItemService,
        robotService: mockRobotService,
        buyRobots: mockBuyRobots
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should throw an error, if robot price is not found', async () => {
        mockItemService.findByName.mockImplementation(({ itemName }) => {
            if (itemName == 'MINING_3') return Promise.resolve({ name: 'MINING_3', price: 100, type: 'UPGRADE' })
            return Promise.resolve(null)
        })
        mockBankAccountService.getBalance.mockReturnValue(500)

        await (expect(getRobotBuyingStrategy())).rejects.toThrow('Robot item undefined 🤖🛑')
    })

    it('should throw an error, if miningUpgrade is not found', async () => {
        mockItemService.findByName.mockImplementation(({ itemName }) => {
            if (itemName == 'ROBOT') return Promise.resolve({ name: 'ROBOT', price: 100, type: 'ITEM' })
            return Promise.resolve(null)
        })
        mockBankAccountService.getBalance.mockReturnValue(500)

        await (expect(getRobotBuyingStrategy())).rejects.toThrow('MiningUpgrade item undefined ⛏️🛑')
    })

    it('should not buy robots if the current robot count exceeds the robot limit', async () => {
        mockItemService.findByName.mockImplementation(({ itemName }) => {
            if (itemName == 'ROBOT') return Promise.resolve({ name: 'ROBOT', price: 100, type: 'ITEM' })
            else if (itemName == 'MINING_3') return Promise.resolve({ name: 'MINING_3', price: 100, type: 'UPGRADE' })
        })
        mockBankAccountService.getBalance.mockReturnValue(new Array(101).fill({}))
        mockRobotService.listRobots.mockResolvedValueOnce(999)

        await getRobotBuyingStrategy()

        expect(mockBuyRobots).toHaveBeenCalledTimes(0)
    })

    it('should not buy robots if the current balance is below or equal to the price of MINING_3 upgrade', async () => {
        mockItemService.findByName.mockImplementation(({ itemName }) => {
            if (itemName == 'ROBOT') return Promise.resolve({ name: 'ROBOT', price: 100, type: 'ITEM' })
            else if (itemName == 'MINING_3') return Promise.resolve({ name: 'MINING_3', price: 100, type: 'UPGRADE' })
        })
        mockBankAccountService.getBalance.mockReturnValue(100)
        mockRobotService.listRobots.mockResolvedValueOnce(new Array(69).fill({}))

        await getRobotBuyingStrategy()

        expect(mockBuyRobots).toHaveBeenCalledTimes(0)
    })

    it('should spend half of the balance to buy robots if the current balance exceeds the price of MINING_3 upgrade', async () => {
        mockItemService.findByName.mockImplementation(({ itemName }) => {
            if (itemName == 'ROBOT') return Promise.resolve({ name: 'ROBOT', price: 69, type: 'ITEM' })
            else if (itemName == 'MINING_3') return Promise.resolve({ name: 'MINING_3', price: 68, type: 'UPGRADE' })
        })
        mockBankAccountService.getBalance.mockReturnValue(69 * 2)
        mockRobotService.listRobots.mockResolvedValueOnce(new Array(69).fill({}))

        await getRobotBuyingStrategy()

        expect(mockBuyRobots).toHaveBeenCalledTimes(1)
        expect(mockBuyRobots).toHaveBeenCalledWith(1)
    })
 })
