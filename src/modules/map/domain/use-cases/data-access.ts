import { ResourceType } from '../../../../shared/types'
import { PlanetData } from '../model/planet'

export type PlanetDb = {
  insert: ({ planetData }: { planetData: PlanetData }) => Promise<PlanetData>

  findById: (queryParams: { id?: string; mapServiceId?: string; resource?: ResourceType }) => Promise<PlanetData | null>

  findAll: () => Promise<PlanetData[]>

  update: ({ planetData }: { planetData: Partial<PlanetData> }) => Promise<PlanetData | null>
}
