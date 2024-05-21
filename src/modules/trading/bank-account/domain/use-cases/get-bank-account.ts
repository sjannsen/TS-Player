import { BankAccount } from '../model/bankAccount'
import { BankAccountDb } from './types'

type getBankAccountDependencies = {
  createBankAccount: ({ initialBalance }: { initialBalance?: number }) => BankAccount
  bankAccountDb: BankAccountDb
}

let bankAccountInstance: BankAccount | null = null

export default function makeGetBankAccount({ createBankAccount, bankAccountDb }: getBankAccountDependencies) {
  return function getBankAccount(): BankAccount {
    if (bankAccountInstance) return bankAccountInstance

    const existing = bankAccountDb.find()

    if (existing) bankAccountInstance = existing
    else bankAccountInstance = createBankAccount({})

    return bankAccountInstance
  }
}
