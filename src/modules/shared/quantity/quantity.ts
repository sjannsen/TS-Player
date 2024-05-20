import { ExceedsCurrentQuantityError, NegativeQuantityError } from './quantity.errors'

type makeQuantityProps = {
  amount?: number
}

export default function makeQuantity({ amount = 0 }: makeQuantityProps): Quantity {
  if (amount < 0) throw new NegativeQuantityError()

  const add = (amountToAdd: number) => {
    if (amountToAdd < 0) throw new NegativeQuantityError('Amount to add must be greater than 0')
    return makeQuantity({ amount: amount + amountToAdd })
  }

  const reduce = (amountToSubtract: number) => {
    if (amountToSubtract < 0) throw new NegativeQuantityError('Amount to subtract must be greater than 0')
    if (amountToSubtract > amount)
      throw new ExceedsCurrentQuantityError('Amount to subtract must not not be greater than current amount')
    return makeQuantity({ amount: amount - amountToSubtract })
  }

  return Object.freeze({
    getAmount: () => amount,
    add,
    reduce,
  })
}
