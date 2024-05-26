import { Planet } from '../model/planet'

export type PlanetDb = {
  insert: (planet: Planet) => Planet
  find: (queryParams: { id?: string; mapServiceId?: string; resource?: ResourceType }) => Planet | undefined
  findAll: () => Planet[]
  update: (planet: Planet) => Planet
}
