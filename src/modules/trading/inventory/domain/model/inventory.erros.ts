class InventoryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InventoryError'
  }
}

class InventoryExceedsCurrentStorageError extends InventoryError {
  constructor(message: string = 'The amount exceeds the current inventory') {
    super(message)
    this.name = 'InventoryExceedsCurrentStorageError'
  }
}

class InvalidStorageEntryError extends InventoryError {
  constructor(message: string = 'Storage entry is invalid') {
    super(message)
    this.name = 'InvalidStorageEntryError'
  }
}

class InventoryNotFoundError extends InventoryError {
  constructor(message: string = 'Inventory not found') {
    super(message)
    this.name = 'InventoryNotFoundError'
  }
}

class InventoryInvalidArgumentError extends InventoryError {
  constructor(message: string = 'A given argument is invalid') {
    super(message)
    this.name = 'InventoryInvalidArgumentError'
  }
}

export {
  InvalidStorageEntryError,
  InventoryError,
  InventoryExceedsCurrentStorageError,
  InventoryInvalidArgumentError,
  InventoryNotFoundError,
}
