import { PlanetData } from '../model/planet'

export type PlanetDb = {
  insert: (planetData: Omit<PlanetData, 'x' | 'y'>) => Promise<Partial<PlanetData> | null>
  findById: ({ id }: { id: string }) => Promise<PlanetData | null>
  findAll: () => Promise<PlanetData[]>
  // findShortestPath: ({ currentId, targetId }: { currentId: string; targetId: string }) => Promise<unknown | null>
  findByMapServiceId: ({ mapServiceId }: { mapServiceId: string }) => Promise<PlanetData | null>
  update: ({
    id,
    mapServiceId,
    movementDifficulty,
    resource,
    x,
    y,
    neighborPlanets,
  }: Partial<PlanetData> & { id: string }) => Promise<PlanetData | null>
}
