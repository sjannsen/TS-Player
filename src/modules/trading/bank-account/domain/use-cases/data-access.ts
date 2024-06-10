import { Transaction, TransactionType } from '../model/bankAccount'

export type TransactionsDatabase = {
  insert: (transaction: Transaction) => Promise<Transaction>
  findAll: () => Promise<Transaction[]>
  findById: (id: string) => Promise<Transaction | []>
  findAllByRoundNumber: (roundNumber: number) => Promise<Transaction[]>
  findAllByType: (type: TransactionType) => Promise<Transaction[]>
}
