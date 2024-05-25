import { mockBankAccountDb, mockMakeMoney } from './mocks/mocks'
import makeCreateBankAccount from './create-bank-account'

describe('createBankAccount', () => {
  it('should create a bank account', () => {
    const createBankAccount = makeCreateBankAccount({ bankAccountDb: mockBankAccountDb, makeMoney: mockMakeMoney })
    createBankAccount({})
    expect(mockBankAccountDb.insert).toHaveBeenCalledTimes(1)
  })
})
