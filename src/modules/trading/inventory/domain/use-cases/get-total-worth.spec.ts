import makeGetTotalWorth from './get-total-worth'
import { MockInventoryDb, clearMockInventoryDb, clearMockInventory, mockInventoryDb } from './mocks/mocks'

describe('getTotalWorth', () => {
  let inventoryDb: MockInventoryDb
  let getTotalWorth: ReturnType<typeof makeGetTotalWorth>

  beforeEach(() => {
    clearMockInventoryDb()
    clearMockInventory()

    inventoryDb = mockInventoryDb
    getTotalWorth = makeGetTotalWorth({ inventoryDb })
  })

  it('returns the total worth of all inventories', () => {
    const totalWorth = getTotalWorth()
    expect(totalWorth).toBe(1000)
  })
})
