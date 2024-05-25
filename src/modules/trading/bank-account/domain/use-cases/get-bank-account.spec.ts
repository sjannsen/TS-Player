import makeGetBankAccount from './get-bank-account'
import { mockBankAccount, mockBankAccountDb } from './mocks/mocks'
import { BankAccountDb } from './types'

describe('getBankAccount', () => {
  const mockCreateBankAccount = jest.fn().mockReturnValue(mockBankAccount)

  it('should create a new bank account, if there is none', () => {
    const mockBankAccountDb: BankAccountDb = {
      find: jest.fn(),
      insert: jest.fn().mockReturnValue(mockBankAccount),
      update: jest.fn(),
    }
    const getBankAccount = makeGetBankAccount({
      createBankAccount: mockCreateBankAccount,
      bankAccountDb: mockBankAccountDb,
    })

    const bankAccount = getBankAccount()

    expect(mockBankAccountDb.find).toHaveBeenCalledTimes(1)
    expect(mockCreateBankAccount).toHaveBeenCalledTimes(1)
    expect(bankAccount).toEqual(mockBankAccount)
  })

  it('should return the existing bank account', () => {
    const getBankAccount = makeGetBankAccount({
      createBankAccount: mockCreateBankAccount,
      bankAccountDb: mockBankAccountDb,
    })

    const bankAccount = getBankAccount()

    expect(bankAccount).toEqual(mockBankAccount)
  })
})
