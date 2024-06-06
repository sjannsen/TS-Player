import { InventoryResources } from '../../../../robot/domain/models/types'
import Id from '../Id'
import buildMakeInventory, { InventoryData } from './inventory'
import {
  InvalidStorageEntryError,
  InventoryExceedsCurrentStorageError,
  InventoryInvalidArgumentError,
} from './inventory.erros'

const makeInventory = buildMakeInventory({ Id: Id })

describe('Inventory', () => {
  describe('makeInventory', () => {
    it('creates an inventory with valid data', () => {
      const initialStorage = { COAL: 0, GEM: 0, GOLD: 0, IRON: 0, PLATIN: 10 }
      const inventory = makeInventory({
        storageLevel: 1,
        maxStorage: 10,
        storage: initialStorage,
      })

      expect(Id.isValidId(inventory.getId())).toBeTruthy()
      expect(inventory.isFull()).toBeTruthy()
      expect(inventory.getFreeCapacity()).toBe(0)
      expect(inventory.getMaxStorage()).toBe(10)
      expect(inventory.getUsedStorage()).toBe(10)
      expect(inventory.getStorage()).toEqual(initialStorage)
    })

    it('creates an inventory with empty storage', () => {
      const emptyStorage = { COAL: 0, GEM: 0, GOLD: 0, IRON: 0, PLATIN: 0 }
      const inventory = makeInventory({
        storageLevel: 1,
        maxStorage: 10,
      })

      expect(Id.isValidId(inventory.getId())).toBeTruthy()
      expect(inventory.isFull()).toBeFalsy()
      expect(inventory.getFreeCapacity()).toBe(10)
      expect(inventory.getMaxStorage()).toBe(10)
      expect(inventory.getUsedStorage()).toBe(0)
      expect(inventory.getStorage()).toEqual(emptyStorage)
    })

    it('throws an error when id is invalid', () => {
      const invalidInventoryData: InventoryData = {
        id: 'invalidId',
        maxStorage: 10,
        storageLevel: 10,
      }
      expect(() => makeInventory(invalidInventoryData)).toThrow(InventoryInvalidArgumentError)
    })

    it('throws an error when is storageLevel is undefined', () => {
      const invalidInventoryData = {
        maxStorage: 10,
      } as InventoryData
      expect(() => makeInventory(invalidInventoryData)).toThrow(InventoryInvalidArgumentError)
    })

    it('throws an error when is storageLevel is negative', () => {
      const invalidInventoryData: InventoryData = {
        id: 'invalidId',
        maxStorage: 10,
        storageLevel: -10,
      }
      expect(() => makeInventory(invalidInventoryData)).toThrow(InventoryInvalidArgumentError)
    })

    it('throws an error when is maxStorage is undefined', () => {
      const invalidInventoryData: InventoryData = {
        id: 'invalidId',
        storageLevel: 10,
      } as InventoryData
      expect(() => makeInventory(invalidInventoryData)).toThrow(InventoryInvalidArgumentError)
    })

    it('throws an error when is maxStorage is negative', () => {
      const invalidInventoryData: InventoryData = {
        id: 'invalidId',
        maxStorage: -10,
        storageLevel: 10,
      }
      expect(() => makeInventory(invalidInventoryData)).toThrow(InventoryInvalidArgumentError)
    })

    it('throws an error when storage contains undefined amount', () => {
      const invalidStorage = { COAL: 0, GEM: undefined, GOLD: 0, IRON: 0, PLATIN: 10 } as unknown as InventoryResources
      const invalidInventoryData: InventoryData = {
        maxStorage: 10,
        storageLevel: 10,
        storage: invalidStorage,
      }
      expect(() => makeInventory(invalidInventoryData)).toThrow(InvalidStorageEntryError)
    })

    it('throws an error when storage contains negative amount', () => {
      const invalidStorage = { COAL: 0, GEM: -10, GOLD: 0, IRON: 0, PLATIN: 10 }
      const invalidInventoryData: InventoryData = {
        maxStorage: 10,
        storageLevel: 10,
        storage: invalidStorage,
      }
      expect(() => makeInventory(invalidInventoryData)).toThrow(InvalidStorageEntryError)
    })
  })

  describe('addToStorage', () => {
    it('adds to the storage', () => {
      const initialStorage = { COAL: 0, GEM: 0, GOLD: 0, IRON: 0, PLATIN: 5 }
      const inventory = makeInventory({
        storageLevel: 1,
        maxStorage: 10,
        storage: initialStorage,
      })

      inventory.addToStorage({ resource: 'COAL', amountToAdd: 5 })

      expect(inventory.getStorage().COAL).toBe(5)
    })

    it('adds a reducet amount when amountToAdd exceeds free capacity', () => {
      const initialStorage = { COAL: 0, GEM: 0, GOLD: 0, IRON: 0, PLATIN: 5 }
      const inventory = makeInventory({
        storageLevel: 1,
        maxStorage: 10,
        storage: initialStorage,
      })

      inventory.addToStorage({ resource: 'COAL', amountToAdd: 15 })

      expect(inventory.getStorage().COAL).toBe(5)
    })

    it('throws an error when adding negative amount', () => {
      const initialStorage = { COAL: 0, GEM: 0, GOLD: 0, IRON: 0, PLATIN: 5 }
      const inventory = makeInventory({
        storageLevel: 1,
        maxStorage: 10,
        storage: initialStorage,
      })

      expect(() => inventory.addToStorage({ resource: 'COAL', amountToAdd: -10 })).toThrow(
        InventoryInvalidArgumentError
      )
    })

    it('throws an error when adding undefined amount', () => {
      const initialStorage = { COAL: 0, GEM: 0, GOLD: 0, IRON: 0, PLATIN: 5 }
      const inventory = makeInventory({
        storageLevel: 1,
        maxStorage: 10,
        storage: initialStorage,
      })

      // @ts-expect-error Testing for invalid argument error when amountToAdd is undefined
      expect(() => inventory.addToStorage({ resource: 'COAL', amountToAdd: undefined })).toThrow(
        InventoryInvalidArgumentError
      )
    })
  })

  describe('addToStorage', () => {
    it('removes from the storage', () => {
      const initialStorage = { COAL: 5, GEM: 0, GOLD: 0, IRON: 0, PLATIN: 0 }
      const inventory = makeInventory({
        storageLevel: 1,
        maxStorage: 10,
        storage: initialStorage,
      })

      inventory.removeFromStorage({ resource: 'COAL', amoutToRemove: 5 })

      expect(inventory.getStorage().COAL).toBe(0)
    })

    it('throws an error when removing more than available', () => {
      const initialStorage = { COAL: 5, GEM: 0, GOLD: 0, IRON: 0, PLATIN: 0 }
      const inventory = makeInventory({
        storageLevel: 1,
        maxStorage: 10,
        storage: initialStorage,
      })

      expect(() => inventory.removeFromStorage({ resource: 'COAL', amoutToRemove: 10 })).toThrow(
        InventoryExceedsCurrentStorageError
      )
    })
    it('throws an error when removing negative amount', () => {
      const initialStorage = { COAL: 5, GEM: 0, GOLD: 0, IRON: 0, PLATIN: 0 }
      const inventory = makeInventory({
        storageLevel: 1,
        maxStorage: 10,
        storage: initialStorage,
      })

      expect(() => inventory.removeFromStorage({ resource: 'COAL', amoutToRemove: -5 })).toThrow(
        InventoryInvalidArgumentError
      )
    })

    it('throws an error when removing undefined amount', () => {
      const initialStorage = { COAL: 5, GEM: 0, GOLD: 0, IRON: 0, PLATIN: 0 }
      const inventory = makeInventory({
        storageLevel: 1,
        maxStorage: 10,
        storage: initialStorage,
      })

      // @ts-expect-error Testing for invalid argument error when amoutToRemove is undefined
      expect(() => inventory.removeFromStorage({ resource: 'COAL', amoutToRemove: undefined })).toThrow(
        InventoryInvalidArgumentError
      )
    })
  })
})
