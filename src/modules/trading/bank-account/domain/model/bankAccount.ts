import Id from '../Id'
import { NegativeBankAccountInitializationError } from './bankAccount.errors'

export type TransactionType = 'deposit' | 'withdraw'

export type Transaction = {
  id: string
  type: TransactionType
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

export type BankAccountData = {
  balance: number
  transactionHistory: Array<Transaction>
}

type makeBankAccountProps = {
  initialBalance?: number
  transactionHistory?: Array<Transaction>
}

type makeBankAccountDependencies = {
  getRoundDuration: () => number | null
}

export default function buildMakeBankAccount({ getRoundDuration }: makeBankAccountDependencies) {
  return function makeBankAccount({
    initialBalance = 0,
    transactionHistory: initialTransactionHistory,
  }: makeBankAccountProps): BankAccount {
    if (initialBalance < 0)
      throw new NegativeBankAccountInitializationError(`InitialBalance is negative: ${initialBalance}`)

    let balance = initialBalance
    const transactionHistory: Array<Transaction> = initialTransactionHistory ?? []

    const makeTransaction = ({ type, amount }: Omit<Transaction, 'time' | 'round' | 'id'>) => {
      const transaction: Transaction = { id: Id.makeId(), type, amount, time: new Date(), round: getRoundDuration() }
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
