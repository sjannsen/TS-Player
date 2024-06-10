import { Money } from '../../../../shared/money/money.types'
import { NegativeBankAccountInitializationError } from './bankAccount.errors'

export type Transaction = {
  type: 'deposit' | 'withdraw'
  amount: number
  time: Date
  round: number | null
}

export type BankAccount = {
  getBalance: () => number
  getTransactionHistory: () => Array<Transaction>
  deposit: (amount: number) => void
  withdraw: (amount: number) => void
}

type makeBankAccountProps = {
  initialBalance?: number
}

type makeBankAccountDependencies = {
  getRoundDuration: () => number | null
}

export default function buildMakeBankAccount({ getRoundDuration }: makeBankAccountDependencies) {
  return function makeBankAccount({ initialBalance = 0 }: makeBankAccountProps): BankAccount {
    if (initialBalance < 0)
      throw new NegativeBankAccountInitializationError(`InitialBalance is negative: ${initialBalance}`)

    let balance = initialBalance
    const transactionHistory: Array<Transaction> = []

    const makeTransaction = ({ type, amount }: Omit<Transaction, 'time' | 'round'>) => {
      const transaction: Transaction = { type, amount, time: new Date(), round: getRoundDuration() }
      transactionHistory.push(transaction)
    }

    const deposit = (amount: number) => {
      balance = balance += amount
      makeTransaction({ type: 'deposit', amount })
    }

    const withdraw = (amount: number) => {
      balance = balance -= amount
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
