import makeResource from './resource'
import { NegativePriceError } from './resource.erros'

describe('makeResource', () => {
  it('creates a resource', () => {
    const ressource = makeResource({ name: 'COAL', initialPrice: 10 })

    expect(ressource.getName()).toBe('COAL')
    expect(ressource.getSellingPrice()).toBe(10)
  })

  it('throws an error, if the initial selling price is 0', () => {
    expect(() => makeResource({ name: 'COAL', initialPrice: 0 })).toThrow(NegativePriceError)
  })

  it('throws an error, if the initial selling price is negative', () => {
    expect(() => makeResource({ name: 'COAL', initialPrice: -10 })).toThrow(NegativePriceError)
  })

  it('updates the selling price', () => {
    const ressource = makeResource({ name: 'COAL', initialPrice: 10 })
    ressource.updateSellingPrice(50)
    expect(ressource.getSellingPrice()).toBe(50)
  })

  it('throws an error, if the updated selling price is 0', () => {
    const ressource = makeResource({ name: 'COAL', initialPrice: 10 })
    expect(() => ressource.updateSellingPrice(0)).toThrow(NegativePriceError)
  })

  it('throws an error, if the updated selling price is negative', () => {
    const ressource = makeResource({ name: 'COAL', initialPrice: 10 })
    expect(() => ressource.updateSellingPrice(-10)).toThrow(NegativePriceError)
  })
})
