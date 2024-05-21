import { BankAccountNotFoundError } from '../model/bankAccount.errors'
import { mockBankAccount, mockBankAccountDb, mockGetBankAccount } from './mocks/mocks'
import makeWithdrawMoney from './withdraw-money'

describe('withdrawMoney', () => {
  it('should call withdrawMoney on bank account', () => {
    const withdrawMoney = makeWithdrawMoney({ getBankAccount: mockGetBankAccount, bankAccountDb: mockBankAccountDb })
    withdrawMoney({ amount: 100 })
    expect(mockBankAccount.withdraw).toHaveBeenCalledTimes(1)
    expect(mockBankAccountDb.update).toHaveBeenCalledTimes(1)
  })

  it('should throw an error, if there is no bank account', () => {
    const withdrawMoney = makeWithdrawMoney({ getBankAccount: jest.fn(), bankAccountDb: mockBankAccountDb })
    expect(() => withdrawMoney({ amount: 100 })).toThrow(BankAccountNotFoundError)
  })
})
