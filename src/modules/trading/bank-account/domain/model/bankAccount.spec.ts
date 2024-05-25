import { getCurrentRoundNumber } from '../../../../game/roundStatus'
import makeMoney from '../../../../shared/money/money'
import buildMakeBankAccount from './bankAccount'
import { NegativeBankAccountInitializationError } from './bankAccount.errors'

const makeBankAccount = buildMakeBankAccount({ makeMoney: makeMoney, getRoundDuration: getCurrentRoundNumber })

describe('makeBankAccount', () => {
  it('should create an empty bankAcount', () => {
    const bankAccount = makeBankAccount({})
    expect(bankAccount.getBalance().getAmount()).toBe(0)
  })

  it('should create an bankAcount with an positive balance', () => {
    const bankAccount = makeBankAccount({ initialBalance: makeMoney({ initialAmount: 100 }) })
    expect(bankAccount.getBalance().getAmount()).toBe(100)
  })

  it('should throw an error if creating an bankAcount with a negative balance', () => {
    expect(() => makeBankAccount({ initialBalance: makeMoney({ initialAmount: -100 }) })).toThrow(
      NegativeBankAccountInitializationError
    )
  })

  it('should initialize bankAccount with empty transaction history', () => {
    const bankAccount = makeBankAccount({})
    expect(bankAccount.getTransactionHistory().length).toBe(0)
  })
})

describe('deposit', () => {
  it('should add money to the balance', () => {
    const bankAccount = makeBankAccount({})
    bankAccount.deposit(100)
    expect(bankAccount.getBalance().getAmount()).toBe(100)
  })

  it('should add a transaction to the transaction history', () => {
    const bankAccount = makeBankAccount({})
    bankAccount.deposit(100)
    expect(bankAccount.getTransactionHistory().length).toBe(1)
    expect(bankAccount.getTransactionHistory()[0].type).toBe('deposit')
    expect(bankAccount.getTransactionHistory()[0].amount).toBe(100)
  })
})

describe('withdraw', () => {
  it('should subtract money from the balance', () => {
    const bankAccount = makeBankAccount({ initialBalance: makeMoney({ initialAmount: 100 }) })
    bankAccount.withdraw(50)
    expect(bankAccount.getBalance().getAmount()).toBe(50)
  })

  it('should turn balance negative, if subtracting more than current balance', () => {
    const bankAccount = makeBankAccount({ initialBalance: makeMoney({ initialAmount: 100 }) })
    bankAccount.withdraw(150)
    expect(bankAccount.getBalance().getAmount()).toBe(-50)
  })

  it('should add a transaction to the transaction history', () => {
    const bankAccount = makeBankAccount({})
    bankAccount.withdraw(100)
    expect(bankAccount.getTransactionHistory().length).toBe(1)
    expect(bankAccount.getTransactionHistory()[0].type).toBe('withdraw')
    expect(bankAccount.getTransactionHistory()[0].amount).toBe(100)
  })
})
