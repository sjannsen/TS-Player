class RobotError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RobotError'
  }
}

class RobotInvalidArgumentError extends RobotError {
  constructor(message: string = 'A given argument is invalid') {
    super(message)
    this.name = 'RobotInvalidArgumentError'
  }
}

class RobotNotFoundError extends RobotError {
  constructor(message: string = 'Robot not found') {
    super(message)
    this.name = 'RobotNotFoundError'
  }
}

class RobotInvalidInventory extends RobotError {
  constructor(message: string) {
    super(message)
    this.name = 'RobotInvalidInventory'
  }
}

export { RobotError, RobotInvalidArgumentError, RobotInvalidInventory, RobotNotFoundError }
