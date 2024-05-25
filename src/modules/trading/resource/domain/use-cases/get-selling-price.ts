import { ResourceType } from '../../../../../shared/types'
import { Resource } from '../model/resource'
import { ResourceNotFoundError } from '../model/resource.erros'

type GetSellingPriceDependencies = {
  getRessource: ({ name }: { name: ResourceType }) => Resource
}

type GetSellingPriceProps = {
  name: ResourceType
}

export default function makeGetSellingPrice({ getRessource }: GetSellingPriceDependencies) {
  return function getSellingPrice({ name }: GetSellingPriceProps): number {
    const ressource = getRessource({ name })
    if (!ressource) throw new ResourceNotFoundError()
    return ressource.getSellingPrice()
  }
}
