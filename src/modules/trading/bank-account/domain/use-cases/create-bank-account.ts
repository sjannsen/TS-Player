import makeBankAccount from '../model'
import { BankAccountDb } from './types'

type createBankAccountProps = {
  initialBalance?: number
}

type createBankAccountDependencies = {
  bankAccountDb: BankAccountDb
}

export default function makeCreateBankAccount({ bankAccountDb }: createBankAccountDependencies) {
  return function createBankAccount({ initialBalance }: createBankAccountProps) {
    const bankAccount = makeBankAccount({ initialBalance })

    return bankAccountDb.insert(bankAccount)
  }
}
