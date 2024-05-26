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

export { PlanetError, PlanetExceedsCurrentResourceError, PlanetInvalidArgumentError, PlanetNotFoundError }
