import makeQuantity from './quantity'
import { ExceedsCurrentQuantityError, NegativeQuantityError } from './quantity.errors'

describe('makeQuantity', () => {
  it('should create an empty quantity', () => {
    const quantity = makeQuantity({})
    expect(quantity.getAmount()).toBe(0)
  })

  it('should create an quantity with positiv amount', () => {
    const quantity = makeQuantity({ amount: 10 })
    expect(quantity.getAmount()).toBe(10)
  })

  it('should throw an error, if creating an quantity with negativ amount', () => {
    expect(() => makeQuantity({ amount: -10 })).toThrow(NegativeQuantityError)
  })
})

describe('add', () => {
  it('should add an positive amount to the quantiy', () => {
    const quantity = makeQuantity({})
    const newQuantity = quantity.add(10)
    expect(newQuantity.getAmount()).toBe(10)
  })

  it('should throw an error, if adding a negative amount to the quantiy', () => {
    const quantity = makeQuantity({})
    expect(() => quantity.add(-10)).toThrow(NegativeQuantityError)
  })
})

describe('reduce', () => {
  it('should subtract an positive amount from the quantiy', () => {
    const quantity = makeQuantity({ amount: 10 })
    const newQuantity = quantity.reduce(5)
    expect(newQuantity.getAmount()).toBe(5)
  })

  it('should throw an error, if subtracting an negative amount from the quantiy', () => {
    const quantity = makeQuantity({ amount: 20 })
    expect(() => quantity.reduce(-10)).toThrow(NegativeQuantityError)
  })

  it('should throw an error, if amount to subtract is greater than current amount', () => {
    const quantity = makeQuantity({ amount: 10 })
    expect(() => quantity.reduce(20)).toThrow(ExceedsCurrentQuantityError)
  })
})
