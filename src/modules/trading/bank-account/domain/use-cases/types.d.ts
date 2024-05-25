import { BankAccount } from '../model/bankAccount'

export type BankAccountDb = {
  insert: (bankAccount: BankAccount) => BankAccount
  find: () => BankAccount
  update: (bankAccount: BankAccount) => BankAccount
}
