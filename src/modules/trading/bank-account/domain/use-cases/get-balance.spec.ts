import { BankAccountNotFoundError } from '../model/bankAccount.errors'
import { mockBankAccount, mockGetBankAccount } from './mocks/mocks'
import makeGetBalance from './get-balance'

describe('getBalance', () => {
  it('should return the balance of the bank account', () => {
    const getBalance = makeGetBalance({ getBankAccount: mockGetBankAccount })

    const result = getBalance()

    expect(mockBankAccount.getBalance).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockBankAccount.getBalance())
  })

  it('should throw an error, if there is no bank account', () => {
    const getBalance = makeGetBalance({ getBankAccount: jest.fn() })
    expect(() => getBalance()).toThrow(BankAccountNotFoundError)
  })
})
