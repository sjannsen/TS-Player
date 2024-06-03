import { ResourceType } from '../../../../../shared/types'
import { Planet } from '../../../domain/model/planet'
import { PlanetDb } from '../../../domain/use-cases/types'

const planetData: Planet[] = []

const matchesId = (id: string | undefined, planet: Planet) => !id || id === planet.getId()
const matchesMapServiceId = (mapServiceId: string | undefined, planet: Planet) =>
  !mapServiceId || mapServiceId === planet.getMapServiceId()

function find({ id, mapServiceId }: { id?: string; mapServiceId?: string; resource?: ResourceType }) {
  return planetData.find((planet) => matchesId(id, planet) && matchesMapServiceId(mapServiceId, planet))
}

function insert(planet: Planet) {
  planetData.push(planet)
  return planet
}

function update(planet: Planet) {
  const index = planetData.findIndex(
    (p) => p.getId() == planet.getId() && p.getMapServiceId() == planet.getMapServiceId()
  )
  planetData[index] = planet
  return planet
}

const planetDb: PlanetDb = {
  find,
  findAll: () => planetData,
  insert,
  update,
}

export default planetDb
