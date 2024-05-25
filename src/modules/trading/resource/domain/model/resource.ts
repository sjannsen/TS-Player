import { ResourceType } from '../../../../../shared/types'
import { NegativePriceError } from './resource.erros'

export type Resource = {
  getName: () => ResourceType
  getSellingPrice: () => number
  updateSellingPrice: (updatedPrice: number) => void
}

type MakeResourceProps = {
  name: ResourceType
  initialPrice: number
}

export default function makeResource({ name, initialPrice }: MakeResourceProps): Resource {
  if (initialPrice <= 0) throw new NegativePriceError('Initial price must be greater than 0')
  let sellingPrice = initialPrice

  const updateSellingPrice = (updatedPrice: number) => {
    if (updatedPrice <= 0) throw new NegativePriceError('Updated selling price must be greater than 0')
    sellingPrice = updatedPrice
  }
  return Object.freeze({
    getName: () => name,
    getSellingPrice: () => sellingPrice,
    updateSellingPrice,
  })
}
