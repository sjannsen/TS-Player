import { Resource } from '../model/resource'

type ResourceDb = {
  insert: (resource: Resource) => Resource
  update: (resource: Resource) => Resource
  find: (string: name) => Resource | undefined
}
