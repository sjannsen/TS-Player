class ResourceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ResourceError'
  }
}

class NegativePriceError extends Error {
  constructor(message: string = 'A price must be greater than 0') {
    super(message)
    this.name = 'NegativePriceError'
  }
}

class ResourceNotFoundError extends ResourceError {
  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'ResourceNotFoundError'
  }
}

export { ResourceError, NegativePriceError, ResourceNotFoundError }
