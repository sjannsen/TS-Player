import { BankAccount } from '../../domain/model/bankAccount'
import { BankAccountDb } from '../../domain/use-cases/types'

// TODO: Provide further logic
const bankAccountDb: BankAccountDb = {
  insert: () => ({}) as BankAccount,
  find: () => ({}) as BankAccount,
  update: () => ({}) as BankAccount,
}

export default bankAccountDb
