class PlanetError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PlanetError'
  }
}

class PlanetExceedsCurrentResourceError extends PlanetError {
  constructor(message: string) {
    super(message)
    this.name = 'PlanetExceedsCurrentResourceError'
  }
}

class PlanetInvalidArgumentError extends PlanetError {
  constructor(message: string = 'A given argument is invalid') {
    super(message)
    this.name = 'PlanetInvalidArgumentError'
  }
}

class PlanetNotFoundError extends PlanetError {
  constructor(message: string = 'Planet not found') {
    super(message)
    this.name = 'PlanetNotFoundError'
  }
}

class PlanetNotAllowedOperationError extends PlanetError {
  constructor(message: string = 'The called operation is not allowed') {
    super(message)
    this.name = 'PlanetNotAllowedOperationError'
  }
}

export {
  PlanetError,
  PlanetExceedsCurrentResourceError,
  PlanetInvalidArgumentError,
  PlanetNotAllowedOperationError,
  PlanetNotFoundError,
}
