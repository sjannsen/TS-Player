import { NegativeAmountError } from './money.errors'
import { Money } from './money.types'

export default function makeMoney({ initialAmount = 0 }: { initialAmount: number }): Money {
  const amount = initialAmount

  const add = (amountToAdd: number) => {
    if (amountToAdd < 0) throw new NegativeAmountError('Amount to add must be greater than 0')
    return makeMoney({ initialAmount: amount + amountToAdd })
  }

  const subtract = (amountToSubtract: number) => {
    if (amountToSubtract < 0) throw new NegativeAmountError('Amount to subtract must be greater than 0')
    return makeMoney({ initialAmount: amount - amountToSubtract })
  }

  return Object.freeze({
    getAmount: () => amount,
    add,
    subtract,
  })
}
