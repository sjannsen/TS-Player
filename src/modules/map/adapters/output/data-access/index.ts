import { ResourceType } from '../../../../../shared/types'
import { PlanetData } from '../../../domain/model/planet'
import { PlanetDb } from '../../../domain/use-cases/data-access'

const planetDataStorage: PlanetData[] = []

const matchesId = (id: string | undefined, planet: PlanetData) => !id || id === planet.id
const matchesMapServiceId = (mapServiceId: string | undefined, planet: PlanetData) =>
  !mapServiceId || mapServiceId === planet.mapServiceId

async function find({ id, mapServiceId }: { id?: string; mapServiceId?: string; resource?: ResourceType }) {
  const planet = planetDataStorage.find((planet) => matchesId(id, planet) && matchesMapServiceId(mapServiceId, planet))
  if (!planet) return null
  return planet
}

async function insert({ planetData }: { planetData: PlanetData }) {
  planetDataStorage.push(planetData)
  return planetData
}

async function update({ planetData }: { planetData: Partial<PlanetData> }) {
  const index = planetDataStorage.findIndex((p) => p.id == planetData.id && p.mapServiceId == planetData.mapServiceId)

  if (!index) return null

  const planet = planetDataStorage[index]
  planetDataStorage[index] = { ...planet, ...planetData }

  return planetDataStorage[index]
}

const planetDb: PlanetDb = {
  findById: find,
  findAll: async () => planetDataStorage,
  insert,
  update,
}

export default planetDb
