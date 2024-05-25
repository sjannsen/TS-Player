import { Money } from '../../../../shared/money/money.types'
import makeBankAccount from '../model'
import { BankAccountDb } from './types'

type createBankAccountProps = {
  initialBalance?: number
}

type createBankAccountDependencies = {
  bankAccountDb: BankAccountDb
  makeMoney: ({ initialAmount }: { initialAmount: number }) => Money
}

export default function makeCreateBankAccount({ bankAccountDb, makeMoney }: createBankAccountDependencies) {
  return function createBankAccount({ initialBalance }: createBankAccountProps) {
    let initialBankAccountBalance
    if (initialBalance) initialBankAccountBalance = makeMoney({ initialAmount: initialBalance })

    const bankAccount = makeBankAccount({ initialBalance: initialBankAccountBalance })

    return bankAccountDb.insert(bankAccount)
  }
}
