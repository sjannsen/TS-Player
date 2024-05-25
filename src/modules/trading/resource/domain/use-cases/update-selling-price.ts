import { ResourceType } from '../../../../../shared/types'
import { Resource } from '../model/resource'
import { ResourceNotFoundError } from '../model/resource.erros'
import { ResourceDb } from './types'

type UpdateSellingPriceDependencies = {
  resourceDb: ResourceDb
  getRessource: ({ name }: { name: ResourceType }) => Resource
}

type UpdateSellingPricePriceProps = {
  name: ResourceType
  updatedPrice: number
}

export default function makeUpdateSellingPrice({ resourceDb, getRessource }: UpdateSellingPriceDependencies) {
  return function updateSellingPrice({ name, updatedPrice }: UpdateSellingPricePriceProps) {
    const ressource = getRessource({ name })
    if (!ressource) throw new ResourceNotFoundError()

    ressource.updateSellingPrice(updatedPrice)
    resourceDb.update(ressource)
  }
}
