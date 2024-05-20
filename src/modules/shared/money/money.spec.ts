import { NegativeAmountError } from './money.errors'
import makeMoney from './money'

describe('makeMoney', () => {
  it('should create money with negative amount', () => {
    const money = makeMoney({ initialAmount: -100 })
    expect(money.getAmount()).toBe(-100)
  })

  it('should create money with positive amount', () => {
    const money = makeMoney({ initialAmount: 100 })
    expect(money.getAmount()).toBe(100)
  })
})

describe('add', () => {
  it('should add a positive amount and return a new money object', () => {
    const money = makeMoney({ initialAmount: 100 })
    const newMoney = money.add(100)

    expect(newMoney.getAmount()).toBe(200)
  })

  it('should throw an error, if try to add a negative amount', () => {
    const money = makeMoney({ initialAmount: 100 })
    expect(() => money.add(-100)).toThrow(NegativeAmountError)
  })
})

describe('subtract', () => {
  it('should subtract a positive amount and return a new money object', () => {
    const money = makeMoney({ initialAmount: 100 })
    const newMoney = money.subtract(100)

    expect(newMoney.getAmount()).toBe(0)
  })

  it('should throw an error, if try to subtract a negative amount', () => {
    const money = makeMoney({ initialAmount: 100 })
    expect(() => money.subtract(-100)).toThrow(NegativeAmountError)
  })

  it('should subtract amount greater than the current amount', () => {
    const money = makeMoney({ initialAmount: 100 })
    const newMoney = money.subtract(150)
    expect(newMoney.getAmount()).toBe(-50)
  })
})
