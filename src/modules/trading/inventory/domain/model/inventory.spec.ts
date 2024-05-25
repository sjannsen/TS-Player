import { Resource } from '../../../resource/domain/model/resource'
import buildMakeInventory, { InventoryData } from './inventory'
import { ExceedsCurrentInventoryError, InventoryEntryNotFoundError } from './inventory.erros'

const mockRessource: Resource = {
  getName: jest.fn().mockReturnValue('COAL'),
  getSellingPrice: jest.fn().mockReturnValue(10),
  updateSellingPrice: jest.fn(),
}

const mockQuantity0: Quantity = {
  add: jest.fn().mockReturnValue(null),
  getAmount: jest.fn().mockReturnValue(0),
  reduce: jest.fn().mockImplementation(() => {
    throw new Error()
  }),
}

const mockQuantity20: Quantity = {
  add: jest.fn().mockReturnValue(null),
  getAmount: jest.fn().mockReturnValue(20),
  reduce: jest.fn(),
}

const mockQuantity10: Quantity = {
  add: jest.fn().mockReturnValue(mockQuantity20),
  getAmount: jest.fn().mockReturnValue(10),
  reduce: jest.fn().mockReturnValue(mockQuantity0),
}

describe('makeInventory', () => {
  it('creates an empty inventory', () => {
    const makeInventory = buildMakeInventory()

    const inventory = makeInventory({ resource: mockRessource, initialInventory: {} })

    expect(inventory.getRessource()).toBe(mockRessource)
    expect(inventory.getTotalAmount()).toBe(0)
    expect(inventory.getTotalWorth()).toBe(0)
    expect(inventory.getInventory()).toEqual({})
  })

  it('creates an inventory with initial inventory', () => {
    const initialInventory: InventoryData = {
      robotId1: mockQuantity10,
      robotId2: mockQuantity10,
      robotId3: mockQuantity10,
    }
    const makeInventory = buildMakeInventory()

    const inventory = makeInventory({ resource: mockRessource, initialInventory: initialInventory })

    expect(inventory.getRessource()).toBe(mockRessource)
    expect(inventory.getTotalAmount()).toBe(30)
    expect(inventory.getTotalWorth()).toBe(300)
    expect(inventory.getInventory()).toEqual(initialInventory)
  })
})

describe('addToInventory', () => {
  it('adds an amount to the inventory', () => {
    const initialInventory: InventoryData = {
      robotId1: mockQuantity10,
      robotId2: mockQuantity10,
      robotId3: mockQuantity10,
    }
    const makeInventory = buildMakeInventory()
    const inventory = makeInventory({ resource: mockRessource, initialInventory: initialInventory })

    inventory.addToInventory({ robotId: 'robotId1', amount: mockQuantity10 })

    expect(inventory.getRessource()).toBe(mockRessource)
    expect(inventory.getTotalAmount()).toBe(40)
    expect(inventory.getTotalWorth()).toBe(400)
  })

  it('throws an error, if the amount to add is negative', () => {}) // Done by Quantity type
})

describe('removeFromInventory', () => {
  it('removes an amount from the inventory', () => {
    const initialInventory: InventoryData = {
      robotId1: mockQuantity10,
      robotId2: mockQuantity10,
      robotId3: mockQuantity10,
    }
    const makeInventory = buildMakeInventory()
    const inventory = makeInventory({ resource: mockRessource, initialInventory: initialInventory })

    inventory.removeFromInventory({ robotId: 'robotId1', amount: mockQuantity10 })

    expect(inventory.getRessource()).toBe(mockRessource)
    expect(inventory.getTotalAmount()).toBe(20)
    expect(inventory.getTotalWorth()).toBe(200)
  })

  it('throws an error, if the amount to remove is negative', () => {}) // Done by Quantity type

  it('throws an error, if the amount to remove exceeds the current amount', () => {
    const initialInventory: InventoryData = {
      robotId1: mockQuantity10,
      robotId2: mockQuantity10,
      robotId3: mockQuantity10,
    }
    const makeInventory = buildMakeInventory()
    const inventory = makeInventory({ resource: mockRessource, initialInventory: initialInventory })

    expect(() => inventory.removeFromInventory({ robotId: 'robotId1', amount: mockQuantity20 })).toThrow(
      ExceedsCurrentInventoryError
    )
  })
})

describe('getTotalAmount', () => {
  it('returns the total amount of the inventory', () => {
    const initialInventory: InventoryData = {
      robotId1: mockQuantity10,
      robotId2: mockQuantity10,
      robotId3: mockQuantity10,
    }
    const makeInventory = buildMakeInventory()
    const inventory = makeInventory({ resource: mockRessource, initialInventory: initialInventory })

    expect(inventory.getTotalAmount()).toBe(30)
  })

  it('returns 0 if the inventory is empty', () => {
    const makeInventory = buildMakeInventory()
    const inventory = makeInventory({ resource: mockRessource, initialInventory: {} })

    expect(inventory.getTotalAmount()).toBe(0)
  })
})

describe('getTotalWorth', () => {
  it('returns the total worth of the inventory', () => {
    const initialInventory: InventoryData = {
      robotId1: mockQuantity10,
      robotId2: mockQuantity10,
      robotId3: mockQuantity10,
    }
    const makeInventory = buildMakeInventory()
    const inventory = makeInventory({ resource: mockRessource, initialInventory: initialInventory })

    expect(inventory.getTotalWorth()).toBe(300)
  })

  it('returns 0 if the inventory is empty', () => {
    const makeInventory = buildMakeInventory()
    const inventory = makeInventory({ resource: mockRessource, initialInventory: {} })

    expect(inventory.getTotalWorth()).toBe(0)
  })
})

describe('getInventoryForRobot', () => {
  it('returns the inventory of a robot', () => {
    const initialInventory: InventoryData = {
      robotId1: mockQuantity10,
      robotId2: mockQuantity10,
      robotId3: mockQuantity10,
    }
    const makeInventory = buildMakeInventory()
    const inventory = makeInventory({ resource: mockRessource, initialInventory: initialInventory })

    const inventoryDataEntry = inventory.getInventoryForRobot({ robotId: 'robotId1' })

    expect(inventoryDataEntry.amount).toEqual(initialInventory['robotId1'])
    expect(inventoryDataEntry.robotId).toBe('robotId1')
    expect(inventoryDataEntry.resource).toBe(mockRessource)
  })

  it('throws an error, if the robot does not exist in inventory', () => {
    const initialInventory: InventoryData = {
      robotId1: mockQuantity10,
      robotId2: mockQuantity10,
      robotId3: mockQuantity10,
    }
    const makeInventory = buildMakeInventory()
    const inventory = makeInventory({ resource: mockRessource, initialInventory: initialInventory })

    expect(() => inventory.getInventoryForRobot({ robotId: 'notExistingRobotId' })).toThrow(InventoryEntryNotFoundError)
  })

  it('throws an error, if the inventory is empty', () => {
    const makeInventory = buildMakeInventory()
    const inventory = makeInventory({ resource: mockRessource, initialInventory: {} })

    expect(() => inventory.getInventoryForRobot({ robotId: 'notExistingRobotId' })).toThrow(InventoryEntryNotFoundError)
  })
})
