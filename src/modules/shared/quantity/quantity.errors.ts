class QuantityError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'QuantityError'
  }
}

class NegativeQuantityError extends QuantityError {
  constructor(message: string = 'Amount of quantity must be greater than 0') {
    super(message)
    this.name = 'NegativeQuantityError'
  }
}

class ExceedsCurrentQuantityError extends QuantityError {
  constructor(message: string = 'Amount of quantity to reduce must not exceed the current amount') {
    super(message)
    this.name = 'ExceedsCurrentQuantityError'
  }
}

export { QuantityError, NegativeQuantityError, ExceedsCurrentQuantityError }
