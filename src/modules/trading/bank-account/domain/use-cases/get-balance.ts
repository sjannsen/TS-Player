import { BankAccount } from '../model/bankAccount'
import { BankAccountNotFoundError } from '../model/bankAccount.errors'

type getBalanceDependencies = {
  getBankAccount: () => BankAccount
}

export default function makeGetBalance({ getBankAccount }: getBalanceDependencies) {
  return function getBalance() {
    const bankAccount = getBankAccount()
    if (!bankAccount) throw new BankAccountNotFoundError()
    return bankAccount.getBalance()
  }
}
