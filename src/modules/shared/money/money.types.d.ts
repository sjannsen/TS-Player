export type Money = {
  getAmount: () => number
  add: (amount: number) => Money
  subtract: (amount: number) => Money
}
