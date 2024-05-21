import { BankAccount } from '../model/bankAccount'
import { BankAccountNotFoundError } from '../model/bankAccount.errors'

type GetTransactionHistoryDependencies = {
  getBankAccount: () => BankAccount
}

export default function makeGetTransactionHistory({ getBankAccount }: GetTransactionHistoryDependencies) {
  return function getTransactionHistory() {
    const bankAccount = getBankAccount()

    if (!bankAccount) throw new BankAccountNotFoundError('No bank account found')

    return bankAccount.getTransactionHistory()
  }
}
