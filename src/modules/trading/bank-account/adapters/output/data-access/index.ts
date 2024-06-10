import { connectToMongoDB } from '../../../../../../db/mongoDB-connection'
import { BankAccount } from '../../../domain/model/bankAccount'
import { BankAccountDb } from '../../../domain/use-cases/types'
import makeTransactionsDatabase from './transactions-database'

// TODO: Provide further logic
let bankAccountData: BankAccount | null = null

const bankAccountDb: BankAccountDb = {
  insert: (bankAccount: BankAccount) => {
    bankAccountData = bankAccount
    return bankAccount
  },
  find: () => bankAccountData as BankAccount,
  update: (bankAccount: BankAccount) => {
    bankAccountData = bankAccount
    bankAccount.getTransactionHistory().forEach(async (transaction) => await transactionsDatabase.insert(transaction))

    return bankAccount
  },
}

const transactionsDatabase = makeTransactionsDatabase({ makeDb: connectToMongoDB })

export default bankAccountDb
export { transactionsDatabase }
