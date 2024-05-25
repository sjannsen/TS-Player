import { BankAccountNotFoundError } from '../model/bankAccount.errors'
import { mockGetBankAccount, mockBankAccountDb, mockBankAccount } from './mocks/mocks'
import makeDepositMoney from './deposit-money'

describe('depositMoney', () => {
  it('should call deposit on bank account', () => {
    const depositMoney = makeDepositMoney({ getBankAccount: mockGetBankAccount, bankAccountDb: mockBankAccountDb })

    depositMoney({ amount: 100 })

    expect(mockBankAccount.deposit).toHaveBeenCalledTimes(1)
    expect(mockBankAccountDb.update).toHaveBeenCalledTimes(1)
  })

  it('should throw an error, if there is no bank account', () => {
    const depositMoney = makeDepositMoney({ getBankAccount: jest.fn(), bankAccountDb: mockBankAccountDb })
    expect(() => depositMoney({ amount: 100 })).toThrow(BankAccountNotFoundError)
  })
})
