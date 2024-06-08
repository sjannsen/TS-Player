import { ResourceType } from '../../../../../shared/types'
import logger from '../../../../../utils/logger'
import { InventoryResources } from '../../../../robot/domain/models/types'
import { Id } from '../Id'
import {
  InvalidStorageEntryError,
  InventoryExceedsCurrentStorageError,
  InventoryInvalidArgumentError,
} from './inventory.erros'

type InventoryDependencies = {
  Id: Id
}

export type InventoryData = {
  id?: string
  storageLevel: number
  maxStorage: number
  storage?: InventoryResources
}

export interface Inventory {
  getId: () => string
  getStorageLevel: () => number
  getUsedStorage: () => number
  getMaxStorage: () => number
  getFreeCapacity: () => number
  isFull: () => boolean
  getStorage: () => InventoryResources
  addToStorage: ({ resource, amountToAdd }: { resource: ResourceType; amountToAdd: number }) => void
  removeFromStorage: ({ resource, amoutToRemove }: { resource: ResourceType; amoutToRemove: number }) => void
}

export default function buildMakeInventory({ Id }: InventoryDependencies) {
  return function makeInventory({
    id = Id.makeId(),
    storageLevel,
    maxStorage,
    storage: initialStorage = { COAL: 0, GEM: 0, GOLD: 0, IRON: 0, PLATIN: 0 },
  }: InventoryData) {
    const ID_INVALID_ERROR = `Id: ${id} is invalid`
    const STORAGE_LEVEL_UNDEFINED_ERROR = `storageLevel: ${storageLevel} is undefined`
    const STORAGE_LEVEL_NEGATIVE_ERROR = `storageLevel: ${storageLevel} is negative`
    const MAX_STORAGE_UNDEFINED_ERROR = `maxStorage: ${maxStorage} is undefined`
    const MAX_STORAGE_NEGATIVE_ERROR = `maxStorage level: ${maxStorage} is negative`
    const STORAGE_AMOUNT_UNDEFINED_ERROR = `storageAmount is undefined`
    const STORAGE_AMOUNT_NEGATIVE_ERROR = `storageAmount is negative`

    if (!Id.isValidId(id)) throw new InventoryInvalidArgumentError(ID_INVALID_ERROR)
    if (storageLevel == null) throw new InventoryInvalidArgumentError(STORAGE_LEVEL_UNDEFINED_ERROR)
    if (storageLevel < 0) throw new InventoryInvalidArgumentError(STORAGE_LEVEL_NEGATIVE_ERROR)
    if (maxStorage == null) throw new InventoryInvalidArgumentError(MAX_STORAGE_UNDEFINED_ERROR)
    if (maxStorage < 0) throw new InventoryInvalidArgumentError(MAX_STORAGE_NEGATIVE_ERROR)

    let usedCapacity = 0
    for (const [resource, amount] of Object.entries(initialStorage)) {
      if (amount === undefined || amount === null)
        throw new InvalidStorageEntryError(`${STORAGE_AMOUNT_UNDEFINED_ERROR}: ${resource} is undefined: ${amount}`)
      if (amount < 0)
        throw new InvalidStorageEntryError(`${STORAGE_AMOUNT_NEGATIVE_ERROR}: ${amount} of ${resource} is negative`)
      usedCapacity += amount
    }

    const storage = { ...initialStorage }

    const addToStorage = ({ resource, amountToAdd }: { resource: ResourceType; amountToAdd: number }) => {
      const RESOURCE_UNDEFINED_ERROR = `resource is undefined`
      const AMOUNT_TO_ADD_UNDEFINED_ERROR = `amountToAdd is undefined`
      const AMOUNT_TO_ADD_NEGATIVE_ERROR = `amountToAdd is negative: ${amountToAdd}`
      const AMOUNT_TO_ADD_EXCEEDS_CAPACITY_WARNING = `amountToAdd: ${amountToAdd} exceeds current capacities: ${maxStorage - usedCapacity}`

      if (!resource) throw new InventoryInvalidArgumentError(RESOURCE_UNDEFINED_ERROR)
      if (!amountToAdd) throw new InventoryInvalidArgumentError(AMOUNT_TO_ADD_UNDEFINED_ERROR)
      if (amountToAdd < 0) throw new InventoryInvalidArgumentError(AMOUNT_TO_ADD_NEGATIVE_ERROR)
      if (amountToAdd > maxStorage - usedCapacity) {
        amountToAdd = maxStorage - usedCapacity
        logger.warn({ resource, amountToAdd, maxStorage, usedCapacity }, AMOUNT_TO_ADD_EXCEEDS_CAPACITY_WARNING)
      }

      usedCapacity += amountToAdd
      storage[resource] += amountToAdd
    }

    const removeFromStorage = ({ resource, amoutToRemove }: { resource: ResourceType; amoutToRemove: number }) => {
      const RESOURCE_UNDEFINED_ERROR = `resource is undefined`
      const AMOUNT_TO_REMOVE_UNDEFINED_ERROR = `amoutToRemove is undefined`
      const AMOUNT_TO_REMOVE_NEGATIVE_ERROR = `amoutToRemove is negative: ${amoutToRemove}`
      const AMOUNT_TO_REMOVE_EXCEEDS_STORAGE_ERROR = `amoutToRemove: ${amoutToRemove} exceeds current storage: ${storage[resource]}`

      if (!resource) throw new InventoryInvalidArgumentError(RESOURCE_UNDEFINED_ERROR)
      if (!amoutToRemove) throw new InventoryInvalidArgumentError(AMOUNT_TO_REMOVE_UNDEFINED_ERROR)
      if (amoutToRemove < 0)
        throw new InventoryInvalidArgumentError(`${AMOUNT_TO_REMOVE_NEGATIVE_ERROR}: ${amoutToRemove}`)
      if (amoutToRemove > storage[resource])
        throw new InventoryExceedsCurrentStorageError(
          `${AMOUNT_TO_REMOVE_EXCEEDS_STORAGE_ERROR}: ${amoutToRemove} exceeds current storage: ${storage[resource]}`
        )

      usedCapacity -= amoutToRemove
      storage[resource] -= amoutToRemove
    }

    return Object.freeze({
      getId: () => id,
      getStorageLevel: () => storageLevel,
      getUsedStorage: () => usedCapacity,
      getMaxStorage: () => maxStorage,
      getFreeCapacity: () => maxStorage - usedCapacity,
      isFull: () => usedCapacity == maxStorage,
      getStorage: () => storage,
      addToStorage,
      removeFromStorage,
    })
  }
}
