import { BankAccountNotFoundError } from '../model/bankAccount.errors'
import makeGetTransactionHistory from './get-transaction-history'
import { mockGetBankAccount, mockTransactionHistory, mockGetTransactionHistory } from './mocks/mocks'

describe('getTransactionHistory', () => {
  it('should return transaction history of the bank account', () => {
    const getTransactionHistory = makeGetTransactionHistory({ getBankAccount: mockGetBankAccount })
    const result = getTransactionHistory()

    expect(mockGetTransactionHistory).toHaveBeenCalledTimes(1)
    expect(mockGetBankAccount).toHaveBeenCalledTimes(1)
    expect(result.length).toBe(2)
    expect(result).toEqual(mockTransactionHistory)
  })

  it('should throw an error, if there is no bank account', () => {
    const mockGetBankAccount = jest.fn()
    const getTransactionHistory = makeGetTransactionHistory({ getBankAccount: mockGetBankAccount })

    expect(() => getTransactionHistory()).toThrow(BankAccountNotFoundError)
  })
})
