import { ResourceType } from '../../../../../shared/types'
import { ResourceNotFoundError } from '../model/resource.erros'
import { ResourceDb } from './types'

type GetRessourceDependencies = {
  ressourceDb: ResourceDb
}

type GetRessourceProps = {
  name: ResourceType
}

export default function makeGetRessource({ ressourceDb }: GetRessourceDependencies) {
  return function getRessource({ name }: GetRessourceProps) {
    const ressource = ressourceDb.find(name)
    if (!ressource) throw new ResourceNotFoundError()
    return ressource
  }
}
