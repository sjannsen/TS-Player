import { BankAccount, Transaction } from '../../model/bankAccount'
import { BankAccountDb } from '../types'

const mockTransactionHistory: Transaction[] = [
  { type: 'deposit', amount: 10, round: 0, time: new Date('May 21, 2024 03:24:00') },
  { type: 'withdraw', amount: 10, round: 1, time: new Date('May 21, 2024 03:25:00') },
]
const mockGetTransactionHistory = jest.fn().mockReturnValue(mockTransactionHistory)
const mockBankAccount: BankAccount = {
  getTransactionHistory: mockGetTransactionHistory,
  getBalance: jest.fn().mockReturnValue(0),
  deposit: jest.fn(),
  withdraw: jest.fn(),
}
const mockGetBankAccount = jest.fn().mockReturnValue(mockBankAccount)

const mockBankAccountDb: BankAccountDb = {
  find: jest.fn().mockReturnValue(mockBankAccount),
  insert: jest.fn(),
  update: jest.fn(),
}

export { mockBankAccount, mockBankAccountDb, mockGetBankAccount, mockGetTransactionHistory, mockTransactionHistory }
