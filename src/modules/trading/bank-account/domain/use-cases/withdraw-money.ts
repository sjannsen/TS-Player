import { BankAccount } from '../model/bankAccount'
import { BankAccountNotFoundError } from '../model/bankAccount.errors'
import { BankAccountDb } from './types'

type WithDrawMoneyDependencies = {
  getBankAccount: () => BankAccount
  bankAccountDb: BankAccountDb
}

type WithDrawMoneyProps = {
  amount: number
}

export default function makeWithdrawMoney({ getBankAccount, bankAccountDb }: WithDrawMoneyDependencies) {
  return function withdrawMoney({ amount }: WithDrawMoneyProps) {
    const bankAccount = getBankAccount()
    if (!bankAccount) throw new BankAccountNotFoundError()

    bankAccount.withdraw(amount)
    bankAccountDb.update(bankAccount)
  }
}
