class BankAccountError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BankAccountError'
  }
}

class NegativeBankAccountInitializationError extends BankAccountError {
  constructor(message: string = 'BankAccount must not be initialized with negative value') {
    super(message)
    this.name = 'NegativeBankAccountInitializationError'
  }
}

class BankAccountNotFoundError extends BankAccountError {
  constructor(message: string = 'BankAccount does not exist') {
    super(message)
    this.name = 'BankAccountNotFoundError'
  }
}

export { BankAccountError, NegativeBankAccountInitializationError, BankAccountNotFoundError }
