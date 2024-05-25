class MoneyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MoneyError'
  }
}

class NegativeAmountError extends MoneyError {
  constructor(message: string = 'Amount must be greater than 0') {
    super(message)
    this.name = 'NegativeAmountError'
  }
}

export { MoneyError, NegativeAmountError }
