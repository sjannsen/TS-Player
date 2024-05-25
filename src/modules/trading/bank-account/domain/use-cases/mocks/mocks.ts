import makeMoney from '../../../../../shared/money/money'
import { Money } from '../../../../../shared/money/money.types'
import { Transaction, BankAccount } from '../../model/bankAccount'
import { BankAccountDb } from '../types'

const mockTransactionHistory: Transaction[] = [
  { type: 'deposit', amount: 10, round: 0, time: new Date('May 21, 2024 03:24:00') },
  { type: 'withdraw', amount: 10, round: 1, time: new Date('May 21, 2024 03:25:00') },
]
const mockGetTransactionHistory = jest.fn().mockReturnValue(mockTransactionHistory)
const mockBankAccount: BankAccount = {
  getTransactionHistory: mockGetTransactionHistory,
  getBalance: jest.fn().mockReturnValue(makeMoney({ initialAmount: 0 })),
  deposit: jest.fn(),
  withdraw: jest.fn(),
}
const mockGetBankAccount = jest.fn().mockReturnValue(mockBankAccount)

const mockBankAccountDb: BankAccountDb = {
  find: jest.fn().mockReturnValue(mockBankAccount),
  insert: jest.fn(),
  update: jest.fn(),
}

const mockMoney: Money = {
  add: jest.fn(),
  subtract: jest.fn(),
  getAmount: jest.fn().mockReturnValue(0),
}
const mockMakeMoney = jest.fn().mockReturnValue(mockMoney)

export {
  mockTransactionHistory,
  mockGetTransactionHistory,
  mockBankAccount,
  mockGetBankAccount,
  mockBankAccountDb,
  mockMakeMoney,
}
