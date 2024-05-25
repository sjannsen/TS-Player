import { BankAccount } from '../model/bankAccount'
import { BankAccountNotFoundError } from '../model/bankAccount.errors'
import { BankAccountDb } from './types'

type DepositMoneyDependencies = {
  getBankAccount: () => BankAccount
  bankAccountDb: BankAccountDb
}

type DepositMoneyProps = {
  amount: number
}

export default function makeDepositMoney({ getBankAccount, bankAccountDb }: DepositMoneyDependencies) {
  return function depositMoney({ amount }: DepositMoneyProps) {
    const bankAccount = getBankAccount()
    if (!bankAccount) throw new BankAccountNotFoundError()

    bankAccount.deposit(amount)
    bankAccountDb.update(bankAccount)
  }
}
