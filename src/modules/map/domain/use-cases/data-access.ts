import { ResourceType } from '../../../../shared/types'
import { PlanetData } from '../model/planet'

export type PlanetDb = {
  insert: (planetData: Omit<PlanetData, 'x' | 'y'>) => Promise<Partial<PlanetData> | null>
  findById: (queryParams: { id?: string; mapServiceId?: string; resource?: ResourceType }) => Promise<PlanetData | null>
  findAll: () => Promise<PlanetData[]>
  addResource: ({ id, resource }: Partial<PlanetData>) => Promise<Partial<PlanetData>>
  addCoordinates: ({ id, x, y }: Partial<PlanetData>) => Promise<Partial<PlanetData> | null>
  updateResourceAmount: ({ id, resource }: Partial<PlanetData>) => Promise<Partial<PlanetData> | null>
  updateNeighbors: ({ id, neighborPlanets }: Partial<PlanetData>) => Promise<Partial<PlanetData> | null>
}
