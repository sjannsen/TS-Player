import { PlanetData } from '../../../domain/model/planet'

const planetDataStorage: PlanetData[] = []

export default function makeInMemoryDatabase() {
  return Object.freeze({
    insert,
    findById,
    findByMapServiceId,
    findAll,
    update,
  })

  async function insert(planetData: Omit<PlanetData, 'x' | 'y'>): Promise<PlanetData | null> {
    planetDataStorage.push(planetData)
    return new Promise((resolve) => resolve(planetData))
  }

  async function findById({ id }: { id: string }): Promise<PlanetData | null> {
    const existing = planetDataStorage.find((planet) => planet.id == id)
    return existing ? existing : null
  }

  async function findAll(): Promise<PlanetData[]> {
    return new Promise((resolve) => resolve(planetDataStorage))
  }

  async function findByMapServiceId({ mapServiceId }: { mapServiceId: string }): Promise<PlanetData | null> {
    const existing = planetDataStorage.find((planet) => planet.mapServiceId == mapServiceId)
    return existing ? existing : null
  }

  async function update({
    id,
    movementDifficulty,
    resource,
    neighborPlanets,
  }: Partial<PlanetData> & { id: string }): Promise<PlanetData | null> {
    const index = planetDataStorage.findIndex((planet) => planet.id == id)
    const updated = { ...planetDataStorage[index], movementDifficulty, resource, neighborPlanets }
    planetDataStorage[index] = updated
    return updated
  }
}
