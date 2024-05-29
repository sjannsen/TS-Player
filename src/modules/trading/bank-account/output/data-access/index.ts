import { BankAccount } from '../../domain/model/bankAccount'
import { BankAccountDb } from '../../domain/use-cases/types'

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
    return bankAccount
  },
}

export default bankAccountDb
