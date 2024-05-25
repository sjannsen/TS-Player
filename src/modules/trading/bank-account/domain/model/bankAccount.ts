import { Money } from '../../../../shared/money/money.types'
import { NegativeBankAccountInitializationError } from './bankAccount.errors'

export type Transaction = {
  type: 'deposit' | 'withdraw'
  amount: number
  time: Date
  round: number | null
}

export type BankAccount = {
  getBalance: () => Money
  getTransactionHistory: () => Array<Transaction>
  deposit: (amount: number) => void
  withdraw: (amount: number) => void
}

type makeBankAccountProps = {
  initialBalance?: Money
}

type makeBankAccountDependencies = {
  makeMoney: ({ initialAmount }: { initialAmount: number }) => Money
  getRoundDuration: () => number | null
}

export default function buildMakeBankAccount({ makeMoney, getRoundDuration }: makeBankAccountDependencies) {
  return function makeBankAccount({ initialBalance }: makeBankAccountProps): BankAccount {
    if (!initialBalance) initialBalance = makeMoney({ initialAmount: 0 })
    if (initialBalance.getAmount() < 0)
      throw new NegativeBankAccountInitializationError('Initial balance must not be negative')

    let balance = initialBalance
    const transactionHistory: Array<Transaction> = []

    const makeTransaction = ({ type, amount }: Omit<Transaction, 'time' | 'round'>) => {
      const transaction: Transaction = { type, amount, time: new Date(), round: getRoundDuration() }
      transactionHistory.push(transaction)
    }

    const deposit = (amount: number) => {
      balance = balance.add(amount)
      makeTransaction({ type: 'deposit', amount })
    }

    const withdraw = (amount: number) => {
      balance = balance.subtract(amount)
      makeTransaction({ type: 'withdraw', amount })
    }

    return Object.freeze({
      getBalance: () => balance,
      getTransactionHistory: () => transactionHistory,
      deposit,
      withdraw,
    })
  }
}
