class InventoryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InventoryError'
  }
}

class NegativePriceError extends InventoryError {
  constructor(message: string = 'A price must be greater than 0') {
    super(message)
    this.name = 'NegativePriceError'
  }
}

class ExceedsCurrentInventoryError extends InventoryError {
  constructor(message: string = 'The amount exceeds the current inventory') {
    super(message)
    this.name = 'ExceedsCurrentInventoryError'
  }
}

class InvalidInventoryDataError extends InventoryError {
  constructor(message: string = 'Inventory data is invalid') {
    super(message)
    this.name = 'InvalidInventoryData'
  }
}

class InventoryEntryNotFoundError extends InventoryError {
  constructor(message: string = 'Inventory data entry not found') {
    super(message)
    this.name = 'InventoryEntryNotFoundError'
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
  InventoryError,
  NegativePriceError,
  ExceedsCurrentInventoryError,
  InvalidInventoryDataError,
  InventoryEntryNotFoundError,
  InventoryNotFoundError,
  InventoryInvalidArgumentError,
}
