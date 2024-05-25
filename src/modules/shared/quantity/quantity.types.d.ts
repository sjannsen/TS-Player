type Quantity = {
  getAmount: () => number
  add: (amountToAdd: number) => Quantity
  reduce: (amountToSubtract: number) => Quantity
  toString: () => string
}
