import { ResourceType } from '../../../../../shared/types'
import makeResource from '../model'
import { ResourceDb } from './types'

type CreateResourceDependencies = {
  resourceDb: ResourceDb
}

type CreateRessourceProps = {
  name: ResourceType
  initialPrice: number
}

export default function makeCreateResource({ resourceDb: ressourceDb }: CreateResourceDependencies) {
  return function createResource({ name, initialPrice }: CreateRessourceProps) {
    const ressource = makeResource({ name, initialPrice })
    ressourceDb.insert(ressource)
  }
}
